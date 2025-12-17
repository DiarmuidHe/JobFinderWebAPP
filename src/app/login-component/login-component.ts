import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    const emailClean = this.email.trim().toLowerCase();
    const passwordClean = this.password; // don't trim passwords unless you want to allow it

    this.auth.login(emailClean, passwordClean).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => {
        this.error = err?.error?.message ?? 'Login failed';
      }
    });
  }

}
