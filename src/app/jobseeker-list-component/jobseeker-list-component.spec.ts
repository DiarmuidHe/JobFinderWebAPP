import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerListComponent } from './jobseeker-list-component';

describe('JobseekerListComponent', () => {
  let component: JobseekerListComponent;
  let fixture: ComponentFixture<JobseekerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobseekerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobseekerListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
