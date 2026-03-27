import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginComponent } from './login-component';
import { AuthService } from '../auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const authServiceStub = {
    login: () => of(void 0),
    beginGoogleLogin: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login() when the form is submitted', () => {
    // Arrange
    const loginSpy = vi.spyOn(authServiceStub, 'login').mockReturnValue(of(void 0));
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.form.setValue({
      email: 'USER@Example.COM',
      password: 'secret1',
      role: 'employer',
    });
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));

    // Act
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    // Assert
    expect(loginSpy).toHaveBeenCalledWith('user@example.com', 'secret1', 'employer');
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should navigate to /admin after a successful admin login', () => {
    // Arrange
    vi.spyOn(authServiceStub, 'login').mockReturnValue(of(void 0));
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.form.setValue({
      email: 'admin@example.com',
      password: 'secret1',
      role: 'admin',
    });
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));

    // Act
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    // Assert
    expect(navigateSpy).toHaveBeenCalledWith('/admin');
  });

  it('should display the API error message when login fails', () => {
    // Arrange
    vi.spyOn(authServiceStub, 'login').mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid credentials' },
      }))
    );

    component.form.setValue({
      email: 'user@example.com',
      password: 'secret1',
      role: 'jobseeker',
    });
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));

    // Act
    form.triggerEventHandler('ngSubmit', {});
    fixture.detectChanges();

    // Assert
    const errorText: HTMLParagraphElement = fixture.debugElement.query(
      By.css('.error-text')
    ).nativeElement;
    expect(errorText.textContent?.trim()).toBe('Invalid credentials');
  });

  it('should call beginGoogleLogin() when the Google button is clicked', () => {
    // Arrange
    const googleLoginSpy = vi.spyOn(authServiceStub, 'beginGoogleLogin');
    const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    const googleButton = buttons.find((button) =>
      (button.nativeElement as HTMLButtonElement).textContent?.includes('Continue with Google')
    );

    // Act
    googleButton?.triggerEventHandler('click');

    // Assert
    expect(googleLoginSpy).toHaveBeenCalled();
  });
});
