import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

// ==========================================
// INTERFACES
// ==========================================
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ==========================================
// AUTH SERVICE
// ==========================================
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Reactive state using signals
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  // Public computed signals
  isAuthenticated = computed(() => !!this.tokenSignal());
  currentUser = computed(() => this.currentUserSignal());
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {
    // Restore session from localStorage on app startup
    this.restoreSession();
  }

  /**
   * Login with username/email and password
   */
  login(username: string, password: string): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null);
      })
    );
  }

  /**
   * Register a new user
   */
  register(name: string, email: string, password: string): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password
    }).pipe(
      tap(response => {
        this.setSession(response);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return of(null);
      })
    );
  }

  /**
   * Logout - clear session and redirect to login
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Get the current JWT token
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Check if the token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode the token payload (middle part)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch {
      return true;
    }
  }

  /**
   * Get current user from API (refresh user data)
   */
  fetchCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
      }),
      catchError(error => {
        console.error('Failed to fetch user:', error);
        this.logout();
        return of(null);
      })
    );
  }

  // ==========================================
  // PRIVATE METHODS
  // ==========================================

  private setSession(response: LoginResponse): void {
    this.tokenSignal.set(response.token);
    this.currentUserSignal.set(response.user);

    // Persist to localStorage
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private restoreSession(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');

    if (token && userJson) {
      // Check if token is expired before restoring
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;

        if (Date.now() < expiry) {
          this.tokenSignal.set(token);
          this.currentUserSignal.set(JSON.parse(userJson));
        } else {
          // Token expired, clear session
          this.clearSession();
        }
      } catch {
        this.clearSession();
      }
    }
  }
}
