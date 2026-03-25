import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SuspensionReasonDialogComponent } from './suspension-reason-dialog.component';

describe('SuspensionReasonDialogComponent', () => {
  let component: SuspensionReasonDialogComponent;
  let fixture: ComponentFixture<SuspensionReasonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspensionReasonDialogComponent],
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

    fixture = TestBed.createComponent(SuspensionReasonDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
