import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Http {

  private baseUrl = 'http://localhost:5000';


  constructor(private http: HttpClient) { }

  getOtp(email: string) {
    return this.http.post(this.baseUrl + '/api/authServices/getOtp', { email });
  }

}
