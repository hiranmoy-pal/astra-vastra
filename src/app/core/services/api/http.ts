import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Http {

  private baseUrl = 'http://localhost:5000';


  constructor(private http: HttpClient) { }

  sentOtp(email: any) {
    return this.http.post(this.baseUrl + '/api/authServices/sentOtp', email);
  }

  verifyOtp(payload: any) {
    return this.http.post(this.baseUrl + '/api/authServices/verifyOtp', payload);
  }

  register(payload: any) {
    return this.http.post(this.baseUrl + '/api/authServices/register', payload);
  }

}
