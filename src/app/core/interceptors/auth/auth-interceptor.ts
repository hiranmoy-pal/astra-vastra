import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Storage } from '../../services/storage/storage'; // Adjust path if needed
import { Http } from '../../services/api/http'; // Adjust path if needed

// ==========================================
// 1. CONTEXT TOKEN (To bypass auth in http.ts)
// ==========================================
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

// ==========================================
// 2. STATE VARIABLES
// ==========================================
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

// ==========================================
// 3. JWT DECODER HELPER
// ==========================================
const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split('.')[1];
    // Safely decode (Handles Server-Side Rendering if window is missing)
    const decodedJson = typeof window !== 'undefined'
      ? atob(payloadBase64)
      : Buffer.from(payloadBase64, 'base64').toString('ascii');

    const payload = JSON.parse(decodedJson);

    if (!payload || !payload.exp) return true;

    // Add a 10-second buffer so we refresh right BEFORE it officially dies
    const expiryTimeMs = payload.exp * 1000;
    return Date.now() > (expiryTimeMs - 10000);
  } catch (e) {
    return true; // Assume expired if it can't be decoded
  }
};

// ==========================================
// 4. MAIN INTERCEPTOR
// ==========================================
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // A. Check Context: If SKIP_AUTH is true, bypass interceptor completely!
  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const storage = inject(Storage);
  const authService = inject(Http);
  const router = inject(Router);

  // B. Retrieve Access Token from IndexedDB
  return from(storage.get<string>('accessToken')).pipe(
    switchMap((accessToken) => {

      // No token at all? Just send the request (or force logout if you prefer)
      if (!accessToken) {
        return next(req);
      }

      // C. Proactive Check: Is it expired?
      if (isTokenExpired(accessToken)) {
        // Pause request, fetch new token, then resume
        return handleRefresh(req, next, storage, authService, router);
      } else {

        // Token is valid! Attach it and proceed.
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });

        return next(authReq).pipe(
          catchError((err: HttpErrorResponse) => {
            // Failsafe: If backend throws 401 anyway (e.g. token manually revoked)
            if (err.status === 401) {
              return handleRefresh(req, next, storage, authService, router);
            }
            return throwError(() => err);
          })
        );
      }
    })
  );
};

// ==========================================
// 5. REFRESH LOGIC
// ==========================================
const handleRefresh = (req: HttpRequest<any>, next: HttpHandlerFn, storage: Storage, authService: Http, router: Router) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return from(storage.get<string>('refreshToken')).pipe(
      switchMap((refreshToken) => {

        // Check if refresh token exists and hasn't expired on frontend
        if (refreshToken && !isTokenExpired(refreshToken)) {

          return authService.refreshTokenAPI({ refreshToken }).pipe(
            switchMap((res: any) => {

              // 1. Explicitly check the backend status flag
              if (res.status === true) {
                isRefreshing = false;

                // 2. Save newly minted tokens to IndexedDB
                storage.set('accessToken', res.token);
                if (res.refreshToken) {
                  storage.set('refreshToken', res.refreshToken);
                }

                refreshTokenSubject.next(res.token);

                // 3. Retry the ORIGINAL request with the NEW token
                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${res.token}` }
                }));
              } else {
                // Backend returned status: false (e.g., token revoked, user disabled)
                return logoutAndRedirect(storage, router, new Error(res.message || 'Session Expired'));
              }
            }),
            catchError((err) => {
              // Refresh API call completely failed (Network error, HTTP 400/500, etc.)
              return logoutAndRedirect(storage, router, err);
            })
          );
        } else {
          // No refresh token found, or it's completely expired locally
          return logoutAndRedirect(storage, router, new Error('Session Expired'));
        }
      })
    );
  } else {
    // If multiple APIs fail at once, queue them up here until the new token arrives
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      })
    );
  }
};

// ==========================================
// 6. LOGOUT HELPER
// ==========================================
const logoutAndRedirect = (storage: Storage, router: Router, err: any) => {
  isRefreshing = false;
  // Clear all Auth Data from IndexedDB
  storage.remove('accessToken');
  storage.remove('refreshToken');
  // Kick user to login screen
  router.navigate(['/login']);
  return throwError(() => err);
};