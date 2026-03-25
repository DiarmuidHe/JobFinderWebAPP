import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeleteAccountConfirmationDialogComponent } from './delete-account-confirmation-dialog.component';

describe('DeleteAccountConfirmationDialogComponent', () => {
  let component: DeleteAccountConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteAccountConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountConfirmationDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { accountName: 'Test User', entityLabel: 'jobseeker' },
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: () => undefined,
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteAccountConfirmationDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
