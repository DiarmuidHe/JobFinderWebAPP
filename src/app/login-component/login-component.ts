import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { UserRole } from '../auth/auth.service';
@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    RouterLink
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  
  readonly hidePassword = signal(true);
  readonly loading = signal(false);
  readonly error = signal('');

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
     role: ['jobseeker' as UserRole, Validators.required],
  });

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    this.error.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, role } = this.form.value;
    if (!email || !password || !role) return;

    this.loading.set(true);

    this.auth
      .login(email.trim().toLowerCase(), password, role)   // use chosen role
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl(role === 'admin' ? '/admin' : '/');
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.error?.message ?? 'Login failed. Please try again.');
        },
      });
  }


  onGoogleLogin(): void {
    this.auth.beginGoogleLogin();
  }
}
