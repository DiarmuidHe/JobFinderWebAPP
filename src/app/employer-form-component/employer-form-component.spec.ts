import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EmployerFormComponent } from './employer-form-component';
import { EmployerService } from '../employers/employer.service';

describe('EmployerFormComponent', () => {
  let component: EmployerFormComponent;
  let fixture: ComponentFixture<EmployerFormComponent>;

  const employerServiceStub = {
    createEmployer: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerFormComponent],
      providers: [
        provideRouter([]),
        { provide: EmployerService, useValue: employerServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmployerFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
