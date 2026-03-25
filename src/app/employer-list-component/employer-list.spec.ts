import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { EmployerList } from './employer-list';
import { EmployerService } from '../employers/employer.service';

describe('EmployerList', () => {
  let component: EmployerList;
  let fixture: ComponentFixture<EmployerList>;

  const employerServiceStub = {
    getEmployers: () => of([]),
    deleteEmployer: () => of(void 0),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerList],
      providers: [
        provideRouter([]),
        { provide: EmployerService, useValue: employerServiceStub },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmployerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
