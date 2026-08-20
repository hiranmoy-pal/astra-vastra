import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Storage } from '../../services/storage/storage'; // Adjust path if needed
import { Http } from '../../services/api/http'; // Adjust path if needed
import { Alert } from '../../services/alert/alert'; // Adjust path if needed

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

// JWT Decoder Helper
const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = typeof window !== 'undefined'
      ? atob(payloadBase64)
      : Buffer.from(payloadBase64, 'base64').toString('ascii');

    const payload = JSON.parse(decodedJson);

    if (!payload || !payload.exp) return true;

    const expiryTimeMs = payload.exp * 1000;
    return Date.now() > (expiryTimeMs - 10000);
  } catch (e) {
    return true;
  }
};

// Main Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const storage = inject(Storage);
  const authService = inject(Http);
  const router = inject(Router);
  const alertService = inject(Alert);
  const httpService = inject(Http);

  return from(storage.get<string>('accessToken')).pipe(
    switchMap((accessToken) => {
      if (!accessToken) {
        return next(req);
      }

      if (isTokenExpired(accessToken)) {
        return handleRefresh(req, next, storage, authService, router, alertService, httpService);
      } else {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });

        return next(authReq).pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              return handleRefresh(req, next, storage, authService, router, alertService, httpService);
            }
            return throwError(() => err);
          })
        );
      }
    })
  );
};

// Refresh Logic
const handleRefresh = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  storage: Storage,
  authService: Http,
  router: Router,
  alertService: Alert,
  httpService: Http,
) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return from(storage.get<string>('refreshToken')).pipe(
      switchMap((refreshToken) => {
        if (refreshToken && !isTokenExpired(refreshToken)) {
          return authService.refreshTokenAPI({ refreshToken }).pipe(
            switchMap((res: any) => {
              if (res.status === true) {
                isRefreshing = false;

                storage.set('accessToken', res.token);
                if (res.refreshToken) {
                  storage.set('refreshToken', res.refreshToken);
                }
                refreshTokenSubject.next(res.token);

                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${res.token}` }
                }));
              } else {
                return logoutAndRedirect(storage, router, alertService, httpService, new Error(res.message || 'Session Expired'));
              }
            }),
            catchError((err) => logoutAndRedirect(storage, router, alertService, httpService, err))
          );
        } else {
          return logoutAndRedirect(storage, router, alertService, httpService, new Error('Session Expired'));
        }
      })
    );
  } else {
    // Queue up parallel API calls while refreshing
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })))
    );
  }
};

// Logout Helper
const logoutAndRedirect = (storage: Storage, router: Router, alertService: Alert, httpService: Http, err: any) => {
  isRefreshing = false;
  httpService.clearProfileCache();
  httpService.authStateChange$.next(false);
  storage.remove('accessToken');
  storage.remove('refreshToken');
  // Trigger the modal alert using your Alert service configuration
  alertService.show({
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again to continue.',
    confirmText: 'OK',
    isDanger: true
  });
  return throwError(() => err);
};