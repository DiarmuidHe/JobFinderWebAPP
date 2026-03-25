import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { OauthComponenent } from './oauth-componenent';
import { AuthService } from '../../auth/auth.service';

describe('OauthComponenent', () => {
  let component: OauthComponenent;
  let fixture: ComponentFixture<OauthComponenent>;

  const activatedRouteStub = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => (key === 'token' ? 'test-token' : null),
      },
    },
  };

  const authServiceStub = {
    completeOAuthLogin: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthComponenent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OauthComponenent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
