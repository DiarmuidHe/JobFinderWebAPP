import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  AccountDetails,
  AccountUpdatePayload,
  ApplicantItem,
  AppliedJobItem,
} from './account.interface';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUri}/account`;

  getMyAccount(): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.apiUrl}/me`);
  }

  updateMyAccount(payload: AccountUpdatePayload): Observable<AccountDetails> {
    return this.http.patch<AccountDetails>(`${this.apiUrl}/me`, payload);
  }

  getAppliedJobs(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/me/applied-jobs`);
  }

  getApplicants(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/me/applicants`);
  }
}
