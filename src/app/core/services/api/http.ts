import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_AUTH } from '../../interceptors/auth/auth-interceptor';
import { catchError, Observable, shareReplay, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Http {

  private baseUrl = 'http://localhost:8080';
  private userProfileCache$: Observable<any> | null = null;
  public authStateChange$ = new Subject<boolean>();
  public profileUpdate$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  // ================== PUBLIC APIs (Skip Interceptor) =================== //

  sentOtp(email: any) {
    return this.http.post(this.baseUrl + '/api/auth/send-otp', email, { context: new HttpContext().set(SKIP_AUTH, true) });
  }

  verifyOtp(payload: any) {
    return this.http.post(this.baseUrl + '/api/auth/verify-otp', payload, { context: new HttpContext().set(SKIP_AUTH, true) });
  }

  register(payload: any, token: string | null) {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', "Bearer " + token);
    }
    return this.http.post(this.baseUrl + '/api/auth/register', payload, { headers, context: new HttpContext().set(SKIP_AUTH, true) });
  }

  refreshTokenAPI(payload: { refreshToken: string }) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${payload.refreshToken}`);
    return this.http.post(this.baseUrl + '/api/auth/refresh', {}, { headers: headers, context: new HttpContext().set(SKIP_AUTH, true) });
  }

  resendOtp(payload: any) {
    return this.http.post(this.baseUrl + '/api/auth/resend-otp', payload, { context: new HttpContext().set(SKIP_AUTH, true) });
  }

  getLocation(pincode: any) {
    return this.http.get("https://api.postalpincode.in/pincode/" + pincode, { context: new HttpContext().set(SKIP_AUTH, true) })
  }

  // ================== PROTECTED APIs =================== //

  getUserProfile(): Observable<any> {
    if (this.userProfileCache$) {
      return this.userProfileCache$;
    }
    this.userProfileCache$ = this.http.get(this.baseUrl + '/api/user/profile').pipe(
      shareReplay(1),
      catchError(err => {
        this.userProfileCache$ = null;
        throw err;
      })
    );
    return this.userProfileCache$;
  }

  clearProfileCache() {
    this.userProfileCache$ = null;
  }

  logoutUserProfile() {
    this.clearProfileCache();
    return this.http.get(this.baseUrl + '/api/auth/logout');
  }

  updateUserProfile(payload: any) {
    return this.http.post(this.baseUrl + '/api/user/edit-profile', payload);
  }

  getAddressTypes() {
    return this.http.get(this.baseUrl + '/api/user/address-type');
  }

  getAddressList() {
    return this.http.get(this.baseUrl + '/api/user/address-list')
  }

  saveAddress(payload: any) {
    return this.http.post(this.baseUrl + '/api/user/save-address', payload);
  }

  deleteAddress(payload: any) {
    return this.http.post(this.baseUrl + '/api/user/delete-address', payload);
  }

}
