import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SKIP_AUTH } from '../../interceptors/auth/auth-interceptor';

@Injectable({
  providedIn: 'root',
})

export class Http {

  private baseUrl = 'http://10.72.249.196:8080';


  constructor(private http: HttpClient) { }

  // ====================================
  // PUBLIC APIs (Skip Interceptor)
  // ====================================

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
    return this.http.post(this.baseUrl + '/api/auth/refresh', payload, { context: new HttpContext().set(SKIP_AUTH, true) });
  }

  resendOtp(payload: any) {
    return this.http.post(this.baseUrl + '/api/auth/resend-otp', payload, { context: new HttpContext().set(SKIP_AUTH, true) });
  }

  // ====================================
  // PROTECTED APIs (Interceptor handles automatically)
  // ====================================



}
