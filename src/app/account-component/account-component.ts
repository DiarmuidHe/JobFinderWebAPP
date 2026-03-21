import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {
  AccountDetails,
  AccountUpdatePayload,
  ApplicantItem,
  AppliedJobItem,
} from '../account/account.interface';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-account-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './account-component.html',
  styleUrl: './account-component.scss',
})
export class AccountComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly activeTab = signal<'details' | 'other'>('details');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editMode = signal(false);
  readonly error = signal('');
  readonly details = signal<AccountDetails | null>(null);
  readonly otherItems = signal<Array<AppliedJobItem | ApplicantItem>>([]);

  readonly title = computed(() =>
    this.details()?.role === 'employer' ? 'Employer Account' : 'My Account'
  );

  readonly otherHeading = computed(() =>
    this.details()?.role === 'employer' ? 'Applicants' : 'Applied Jobs'
  );

  readonly form = this.fb.group({
    name: [{ value: '', disabled: true }],
    email: [{ value: '', disabled: true }, [Validators.email]],
    skills: [{ value: '', disabled: true }],
    companyName: [{ value: '', disabled: true }],
    contactEmail: [{ value: '', disabled: true }, [Validators.email]],
    location: [{ value: '', disabled: true }],
    description: [{ value: '', disabled: true }],
    logo: [{ value: '', disabled: true }],
    password: [{ value: '', disabled: true }, [Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.loadAccountPage();
  }

  setTab(tab: 'details' | 'other'): void {
    this.activeTab.set(tab);
  }

  enableEdit(): void {
    this.editMode.set(true);
    this.form.enable();
  }

  cancelEdit(): void {
    this.editMode.set(false);
    this.form.disable();
    const details = this.details();
    if (details) {
      this.populateForm(details);
    }
  }

  saveDetails(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const details = this.details();
    if (!details) {
      return;
    }

    const payload = this.buildPayload(details);
    if (Object.keys(payload).length === 0) {
      this.snackBar.open('No changes to save.', 'Close', { duration: 2500 });
      return;
    }

    this.saving.set(true);
    this.accountService
      .updateMyAccount(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updatedDetails) => {
          this.details.set(updatedDetails);
          this.populateForm(updatedDetails);
          this.syncAuthUser(updatedDetails);
          this.editMode.set(false);
          this.form.disable();
          this.snackBar.open('Account details updated.', 'Close', { duration: 3000 });
        },
        error: (err) => {
          this.snackBar.open(
            err?.error?.message ?? 'Unable to update account details.',
            'Close',
            { duration: 4000 }
          );
        },
      });
  }

  getAppliedJobTitle(item: AppliedJobItem): string {
    return item.title || item.jobTitle || item.jobId;
  }

  getAppliedEmployerName(item: AppliedJobItem): string {
    return item.employerName || item.companyName || item.employerId || 'Employer unavailable';
  }

  getApplicantName(item: ApplicantItem): string {
    return item.applicantName || item.name || item.applicantEmail || item.email || 'Unknown applicant';
  }

  getApplicantEmail(item: ApplicantItem): string {
    return item.applicantEmail || item.email || 'No email provided';
  }

  getApplicantJobTitle(item: ApplicantItem): string {
    return item.jobTitle || item.title || item.jobId;
  }

  private loadAccountPage(): void {
    this.loading.set(true);
    this.error.set('');

    this.accountService
      .getMyAccount()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (details) => {
          this.details.set(details);
          this.populateForm(details);
          this.form.disable();
          this.loadOtherTab(details.role);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Unable to load account details.');
        },
      });
  }

  private loadOtherTab(role: 'jobseeker' | 'employer'): void {
    const request$: Observable<unknown> =
      role === 'employer'
        ? this.accountService.getApplicants()
        : this.accountService.getAppliedJobs();

    request$.subscribe({
      next: (response: unknown) => {
        this.otherItems.set(this.normalizeOtherItems(response));
      },
      error: (err: { error?: { message?: string } }) => {
        console.error('Unable to load account tab data', err);
        this.otherItems.set([]);
      },
    });
  }

  private normalizeOtherItems(response: unknown): Array<AppliedJobItem | ApplicantItem> {
    if (Array.isArray(response)) {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const wrappedArrays = Object.values(response as Record<string, unknown>).find((value) =>
      Array.isArray(value)
    );

    return Array.isArray(wrappedArrays) ? (wrappedArrays as Array<AppliedJobItem | ApplicantItem>) : [];
  }

  private populateForm(details: AccountDetails): void {
    if (details.role === 'jobseeker') {
      this.form.patchValue({
        name: details.name ?? '',
        email: details.email ?? '',
        skills: (details.skills ?? []).join(', '),
        companyName: '',
        contactEmail: '',
        location: '',
        description: '',
        logo: '',
        password: '',
      });
      return;
    }

    this.form.patchValue({
      name: '',
      email: '',
      skills: '',
      companyName: details.companyName ?? '',
      contactEmail: details.contactEmail ?? '',
      location: details.location ?? '',
      description: details.description ?? '',
      logo: details.logo ?? '',
      password: '',
    });
  }

  private buildPayload(details: AccountDetails): AccountUpdatePayload {
    const raw = this.form.getRawValue();
    const password = raw.password?.trim();

    if (details.role === 'jobseeker') {
      const payload: AccountUpdatePayload = {};
      const nextName = raw.name?.trim();
      const nextEmail = raw.email?.trim().toLowerCase();
      const nextSkills = (raw.skills ?? '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (nextName && nextName !== details.name) {
        payload.name = nextName;
      }

      if (nextEmail && nextEmail !== details.email) {
        payload.email = nextEmail;
      }

      if (JSON.stringify(nextSkills) !== JSON.stringify(details.skills ?? [])) {
        payload.skills = nextSkills;
      }

      if (password) {
        payload.password = password;
      }

      return payload;
    }

    const payload: AccountUpdatePayload = {};
    const nextCompanyName = raw.companyName?.trim();
    const nextContactEmail = raw.contactEmail?.trim().toLowerCase();
    const nextLocation = raw.location?.trim();
    const nextDescription = raw.description?.trim();
    const nextLogo = raw.logo?.trim() ? raw.logo.trim() : null;

    if (nextCompanyName && nextCompanyName !== details.companyName) {
      payload.companyName = nextCompanyName;
    }

    if (nextContactEmail && nextContactEmail !== details.contactEmail) {
      payload.contactEmail = nextContactEmail;
    }

    if ((nextLocation ?? '') !== (details.location ?? '')) {
      payload.location = nextLocation ?? '';
    }

    if ((nextDescription ?? '') !== (details.description ?? '')) {
      payload.description = nextDescription ?? '';
    }

    if (nextLogo !== details.logo) {
      payload.logo = nextLogo;
    }

    if (password) {
      payload.password = password;
    }

    return payload;
  }

  private syncAuthUser(details: AccountDetails): void {
    this.authService.updateCurrentUserProfile(
      details.role === 'employer' ? details.companyName : details.name,
      details.role === 'employer' ? details.contactEmail : details.email
    );
  }
}
