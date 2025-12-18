import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Job Search App');

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  onEmployersClick(): void {
    const user = this.auth.getCurrentUser();

    if (user && user.role === 'employer') {
      // Go to THIS employer’s detail page
      this.router.navigate(['/employers', user._id]);
    } else {
      // Fallback: go to the employers list for everyone else
      this.router.navigate(['/employers']);
    }
  }
    logout(): void {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
}
