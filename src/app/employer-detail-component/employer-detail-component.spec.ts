import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EmployerDetailComponent } from './employer-detail-component';
import { AuthService } from '../auth/auth.service';
import { EmployerService } from '../employers/employer.service';

describe('EmployerDetailComponent', () => {
  let component: EmployerDetailComponent;
  let fixture: ComponentFixture<EmployerDetailComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => (key === 'id' ? 'employer-1' : null),
      },
    },
  };

  const employerServiceStub = {
    getEmployerById: () =>
      of({
        _id: 'employer-1',
        companyName: 'Test Employer',
        contactEmail: 'test@example.com',
        jobs: [],
      }),
    toggleJobActive: () => of({}),
    addJobs: () => of({ message: 'ok', added: [] }),
    deleteEmployer: () => of(void 0),
  };

  const authServiceStub = {
    logout: () => undefined,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: EmployerService, useValue: employerServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmployerDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
