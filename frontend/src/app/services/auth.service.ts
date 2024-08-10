import { catchError, Observable, tap } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loginError: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, {
        client_id: username,
        client_secret: password,
      })
      .pipe(
        tap((response) => this.handleLoginSuccess(response)),
        catchError((error) => this.handleLoginError(error))
      );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getLoginError(): string | null {
    return this.loginError;
  }

  private handleLoginSuccess(response: any) {
    const token = response.access_token;

    if (!token) {
      this.loginError = 'Login failed due to a missing access token';
    }

    localStorage.setItem('token', token);
    this.router.navigate(['/manage']);
  }

  private async handleLoginError(error: any): Promise<void> {
    this.loginError =
      error?.error?.error || 'Login failed due to an unknown error';
  }
}
