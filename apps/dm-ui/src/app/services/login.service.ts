import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ServiceResponse } from '../models/common.model';
import { LoginRequest } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  register(loginRequest: LoginRequest): Observable<boolean> {
    return this.http
      .post<ServiceResponse>(`http://localhost:8080/dm/userAuth/signin`, loginRequest)
      .pipe(map((response) => response.success));
  }
}
