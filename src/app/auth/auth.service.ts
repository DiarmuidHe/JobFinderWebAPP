import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JobSeeker } from '../jobseekers/jobseeker.interface';

const STORAGE_KEY_USER = 'currentJobSeeker';
const STORAGE_KEY_TOKEN = 'accessToken';

type LoginResponse = { accessToken: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = `${environment.apiUri}/auth/register`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string, name: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.authUrl, { email, password, name }).pipe(
      tap((resp) => {
        localStorage.setItem(STORAGE_KEY_TOKEN, resp.accessToken);
      })
    );
  }

  setCurrentJobSeeker(jobSeeker: JobSeeker): void {
    const data = {
      _id: jobSeeker._id,
      name: jobSeeker.name,
      email: jobSeeker.email
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data));
  }

  getCurrentJobSeeker(): JobSeeker | null {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as JobSeeker;
    } catch {
      return null;
    }
  }

  getCurrentJobSeekerId(): string | null {
    return this.getCurrentJobSeeker()?._id ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}
