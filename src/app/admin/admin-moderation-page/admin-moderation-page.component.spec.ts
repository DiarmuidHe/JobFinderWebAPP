import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { AdminModerationPageComponent } from './admin-moderation-page.component';
import { AdminService } from '../admin.service';

describe('AdminModerationPageComponent', () => {
  let component: AdminModerationPageComponent;
  let fixture: ComponentFixture<AdminModerationPageComponent>;

  const adminServiceStub = {
    listAccounts: () => of([]),
    getAccountDetails: () => of(),
    suspendAccount: () => of(),
    unsuspendAccount: () => of(),
    deleteAccount: () => of(),
  };

  const snackBarStub = {
    open: () => undefined,
  };

  const dialogStub = {
    open: () => ({
      afterClosed: () => of(false),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModerationPageComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceStub },
        { provide: MatSnackBar, useValue: snackBarStub },
        { provide: MatDialog, useValue: dialogStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminModerationPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
