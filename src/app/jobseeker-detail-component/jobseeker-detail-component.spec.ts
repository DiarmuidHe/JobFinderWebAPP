import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { JobseekerDetailComponent } from './jobseeker-detail-component';
import { AuthService } from '../auth/auth.service';
import { EmployerService } from '../employers/employer.service';
import { JobSeekerService } from '../jobseekers/jobseeker.service';

describe('JobseekerDetailComponent', () => {
  let component: JobseekerDetailComponent;
  let fixture: ComponentFixture<JobseekerDetailComponent>;

  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: (key: string) => {
          if (key === 'employerId') {
            return 'employer-1';
          }

          if (key === 'jobId') {
            return 'job-1';
          }

          return null;
        },
      },
    },
  };

  const employerServiceStub = {
    getEmployerById: () =>
      of({
        _id: 'employer-1',
        companyName: 'Test Employer',
        contactEmail: 'test@example.com',
        jobs: [
          {
            jobId: 'job-1',
            title: 'Backend Engineer',
            description: 'Build APIs',
            location: 'Dublin',
            jobType: 'full-time',
            active: true,
            postedAt: '2026-03-23T00:00:00.000Z',
            categories: [],
          },
        ],
      }),
  };

  const jobSeekerServiceStub = {
    addApplication: () => of({}),
  };

  const authServiceStub = {
    getCurrentUserId: () => 'jobseeker-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobseekerDetailComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: EmployerService, useValue: employerServiceStub },
        { provide: JobSeekerService, useValue: jobSeekerServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(JobseekerDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
