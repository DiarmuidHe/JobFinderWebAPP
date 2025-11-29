import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployerService } from '../employers/employer.service';
import { Employer } from '../employers/employer.interface';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-employer-form-component',
  imports: [RouterLink, ReactiveFormsModule,MatProgressBar, MatToolbar, MatCard, MatCardContent, MatCardTitle, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './employer-form-component.html',
  styleUrl: './employer-form-component.scss',
})
export class EmployerFormComponent implements OnInit{
  employerForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employerService: EmployerService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.employerForm = this.fb.group({
      companyName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      location: ['', Validators.required],
      logo: ['']
    });
  }

  onSubmit(): void {
    if (this.employerForm.invalid) {
      this.employerForm.markAllAsTouched();
      return;
    }

    const employer: Employer = {
      ...this.employerForm.value,
      jobs: []
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    this.employerService.createEmployer(employer).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/employers']);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to create employer.';
        this.isSubmitting = false;
        this.cdr.markForCheck();   
      }
    });
  }

  get companyName() { return this.employerForm.get('companyName'); }
  get contactEmail() { return this.employerForm.get('contactEmail'); }
  get description() { return this.employerForm.get('description'); }
  get location() { return this.employerForm.get('location'); }
  get logo() { return this.employerForm.get('logo'); }

}
