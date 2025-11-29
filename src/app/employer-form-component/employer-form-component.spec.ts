import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerFormComponent } from './employer-form-component';

describe('EmployerFormComponent', () => {
  let component: EmployerFormComponent;
  let fixture: ComponentFixture<EmployerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerFormComponent]
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
