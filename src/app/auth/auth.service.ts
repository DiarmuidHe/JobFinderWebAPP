import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JobSeeker } from '../jobseekers/jobseeker.interface';

const STORAGE_KEY_USER = 'currentJobSeeker';
const STORAGE_KEY_TOKEN = 'accessToken';

type LoginResponse = {
  accessToken: string;
};

type RegisterResponse = {
  message: string;
  id: string;
};

type JwtPayload = {
  sub?: string;
  id?: string;
  email: string;
  name?: string;
  exp: number;        // standard JWT expiry (seconds since epoch)
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUri;
  private http = inject(HttpClient);

  readonly currentJobSeeker$ = new BehaviorSubject<JobSeeker | null>(null);
  readonly isAuthenticated$ = new BehaviorSubject<boolean>(false);

  private authTimeoutId?: any;

  constructor() {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticated$.next(false);
      return;
    }

    const payload = this.safeDecodeToken(token);
    if (!payload) {
      this.clearAuth();
      return;
    }

    const expires = payload.exp * 1000;
    if (expires > Date.now()) {
      const jobSeeker: JobSeeker = {
        _id: (payload.sub || payload.id) as string,
        name: payload.name ?? '',
        email: payload.email
      };

      this.currentJobSeeker$.next(jobSeeker);
      this.isAuthenticated$.next(true);
      this.startAuthTimer(expires);
    } else {
      this.clearAuth();
    }
  }


  // PUBLIC API

  login(email: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((body) => {
          this.setSessionFromToken(body.accessToken);
        })
      );
  }


  

  // register creates the account, then auto-logs in with same creds
  register(name: string, email: string, password: string): Observable<void> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, { name, email, password })
      .pipe(
        switchMap(() => this.login(email, password))
      );
  }

  beginGoogleLogin(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  completeOAuthLogin(token: string): void {
    this.setSessionFromToken(token);
  }

  
  getCurrentJobSeeker(): JobSeeker | null {
    return this.currentJobSeeker$.value;
  }

  getCurrentJobSeekerId(): string | null {
    return this.currentJobSeeker$.value?._id ?? null;
  }

  getToken(): string | null {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token || token === 'undefined' || token === 'null') return null;
    return token;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated$.value;
  }

  logout(): void {
    this.clearAuth();
  }

  // INTERNAL HELPERS
  private setSessionFromToken(token: string): void {
    const payload = this.safeDecodeToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    const expires = payload.exp * 1000;

    const jobSeeker: JobSeeker = {
      _id: (payload.sub || payload.id) as string,
      name: payload.name ?? '',
      email: payload.email
    };

    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(jobSeeker));

    this.currentJobSeeker$.next(jobSeeker);
    this.isAuthenticated$.next(true);
    this.startAuthTimer(expires);
  }
  
  private clearAuth() {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    this.currentJobSeeker$.next(null);
    this.isAuthenticated$.next(false);
    if (this.authTimeoutId) {
      clearTimeout(this.authTimeoutId);
      this.authTimeoutId = undefined;
    }
  }

  private startAuthTimer(expires: number) {
    // re-auth / logout 1 minute before expiry
    const timeout = expires - Date.now() - 60_000;
    if (timeout <= 0) {
      this.logout();
      return;
    }

    if (this.authTimeoutId) {
      clearTimeout(this.authTimeoutId);
    }

    this.authTimeoutId = setTimeout(() => {
      // refresh not implemented → logout instead
      this.logout();
    }, timeout);
  }

  private safeDecodeToken(token: string): JwtPayload | null {
    try {
      if (!token.includes('.')) return null;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const payloadJson = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(payloadJson) as JwtPayload;
    } catch (err) {
      console.error('Failed to decode JWT', err);
      return null;
    }
  }
}
