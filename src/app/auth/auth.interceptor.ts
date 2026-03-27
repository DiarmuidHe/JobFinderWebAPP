import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService as AuthCustomService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthCustomService);

  const authApiUris = environment.authApiUris;
  const jwt = authService.getToken();

  const authRequest =
    authApiUris.some((apiUri) => req.url.startsWith(apiUri)) && jwt
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${jwt}` },
        })
      : req;

  return next(authRequest).pipe(
    catchError((err) => {
      console.error('HTTP error', err);

      if (err.status === 401 || err.status === 403) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
