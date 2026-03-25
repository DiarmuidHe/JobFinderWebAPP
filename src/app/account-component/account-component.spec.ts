import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { AccountComponent } from './account-component';
import { AccountService } from '../account/account.service';
import { AuthService } from '../auth/auth.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  const accountServiceStub = {
    getMyAccount: () =>
      of({
        role: 'jobseeker',
        name: 'Test User',
        email: 'test@example.com',
        skills: [],
      }),
    updateMyAccount: () => of(),
    getAppliedJobs: () => of([]),
    getApplicants: () => of([]),
  };

  const authServiceStub = {
    updateCurrentUserProfile: () => undefined,
  };

  const snackBarStub = {
    open: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        { provide: AccountService, useValue: accountServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: MatSnackBar, useValue: snackBarStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
