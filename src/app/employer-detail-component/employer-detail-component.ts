import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employer } from '../employers/employer.interface';
import { Job } from '../jobs/job.interface';
import { EmployerService } from '../employers/employer.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-employer-detail-component',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatSlideToggle,
    MatProgressBar,
    MatTableModule,
    MatToolbar,
    MatCardHeader,
    CommonModule
  ],
  templateUrl: './employer-detail-component.html',
  styleUrl: './employer-detail-component.scss',
})
export class EmployerDetailComponent implements OnInit {
  employer: Employer | null = null;
  jobsDataSource = new MatTableDataSource<Job>([]);
  displayedJobColumns = [
    'title',
    'location',
    'jobType',
    'salary',
    'active',
    'postedAt',
    'actions'
  ];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employerService: EmployerService,
    private cdr: ChangeDetectorRef          //  inject this
  ) {}

  ngOnInit(): void {
    this.loadEmployer();
  }

  loadEmployer(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid employer id.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading employer', id);

    this.employerService.getEmployerById(id).subscribe({
      next: (employer) => {
        console.log('Employer loaded', employer);
        this.employer = employer;
        this.jobsDataSource.data = employer.jobs || [];
        this.isLoading = false;

        this.cdr.markForCheck();           // tell Angular to update the view
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Failed to load employer.';
        this.isLoading = false;

        this.cdr.markForCheck();           // also on error
      }
    });
  }

  onToggleActive(job: Job): void {
    if (!this.employer || !this.employer._id) return;

    const newValue = !job.active;
    this.employerService
      .toggleJobActive(this.employer._id, job.jobId, newValue)
      .subscribe({
        next: (updatedJob) => {
          job.active = updatedJob.active;
          this.jobsDataSource.data = [...this.jobsDataSource.data];
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = 'Failed to toggle job status.';
          this.cdr.markForCheck();
        }
      });
  }

  getSalaryDisplay(job: Job): string {
    if (!job.salary) return '';
    return `${job.salary.currency} ${job.salary.min} - ${job.salary.max}`;
  }
}
