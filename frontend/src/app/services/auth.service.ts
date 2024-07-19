import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loginSubscription: Subscription  | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    this.loginSubscription = this.http.post<{ token: string }>(`${this.apiUrl}/login`, { "client_id": "foo", "client_secret": "bar", username, password })
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
  }

  private handleLoginSuccess(response: any) {
    // Consider a more secure storage mechanism
    const token = response.access_token;
    localStorage.setItem('token', token);
    // Let the component handle navigation
    this.router.navigate(['/manage']);
  }

  private handleLoginError(error: any): void {
    // Implement more sophisticated error handling
    console.error('Login failed', error);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  ngOnDestroy(): void {
    // Ensure to unsubscribe to prevent memory leaks
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
