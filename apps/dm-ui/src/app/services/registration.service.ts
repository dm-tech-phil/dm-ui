import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RegistrationRequest } from '../models/registration.model';
import { ServiceResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  register(registrationRequest: RegistrationRequest): Observable<boolean> {
    return this.http
      .post<ServiceResponse>(
        `http://localhost:8080/dm/userAuth/signup`,
        registrationRequest
      )
      .pipe(map((response) => response.success));
  }
}
