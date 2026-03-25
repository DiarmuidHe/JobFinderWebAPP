import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: typeof AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = AuthInterceptor;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
