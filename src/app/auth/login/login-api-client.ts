import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginApiClient {

  private readonly httpClient: HttpClient = inject(HttpClient);

  iniciarSesion(email: string, clave: string): Observable<{ accessToken: string }> {
    return this.httpClient.post<{ accessToken: string }>('/api/v1/auth/login', { email, clave });
  }
}