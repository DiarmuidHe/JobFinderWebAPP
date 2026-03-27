import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SuspensionEmailPayload {
  email: string;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class SuspensionEmailService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://api.emailjs.com/api/v1.0/email/send';

  sendSuspensionEmail(payload: SuspensionEmailPayload): Observable<boolean> {
    const email = payload.email.trim();
    const reason = payload.reason.trim();

    if (!email || !reason || !this.isConfigured()) {
      return of(false);
    }

    return this.http
      .post(
        this.endpoint,
        {
          service_id: environment.emailjs.serviceId,
          template_id: environment.emailjs.templateId,
          user_id: environment.emailjs.publicKey,
          template_params: {
            email,
            reason,
          },
        },
        {
          responseType: 'text',
        }
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  private isConfigured(): boolean {
    return Boolean(
      environment.emailjs.serviceId.trim() &&
        environment.emailjs.templateId.trim() &&
        environment.emailjs.publicKey.trim()
    );
  }
}
