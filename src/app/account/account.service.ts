import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AccountDetails,
  AccountUpdatePayload,
} from './account.interface';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  getMyAccount(): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(environment.accountEndpoints.me);
  }

  updateMyAccount(payload: AccountUpdatePayload): Observable<AccountDetails> {
    return this.http.patch<AccountDetails>(environment.accountEndpoints.me, payload);
  }

  getAppliedJobs(): Observable<unknown> {
    return this.http.get<unknown>(environment.accountEndpoints.appliedJobs);
  }

  getApplicants(): Observable<unknown> {
    return this.http.get<unknown>(environment.accountEndpoints.applicants);
  }
}
