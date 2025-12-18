import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-oauth-componenent',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './oauth-componenent.html',
  styleUrl: './oauth-componenent.scss',
})
export class OauthComponenent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.router.navigate(['/login'], {
        queryParams: { oauthError: 'missing_token' }
      });
      return;
    }

    try {
      this.auth.completeOAuthLogin(token);
      this.router.navigateByUrl('/');
    } catch {
      this.router.navigate(['/login'], {
        queryParams: { oauthError: 'invalid_token' }
      });
    }
  }
}
