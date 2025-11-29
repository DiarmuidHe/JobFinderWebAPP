import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerDetailComponent } from './jobseeker-detail-component';

describe('JobseekerDetailComponent', () => {
  let component: JobseekerDetailComponent;
  let fixture: ComponentFixture<JobseekerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobseekerDetailComponent]
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
