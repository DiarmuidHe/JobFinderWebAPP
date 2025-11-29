import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerList } from './employer-list-component/employer-list';
import { EmployerDetailComponent } from './employer-detail-component/employer-detail-component';
import { EmployerFormComponent } from './employer-form-component/employer-form-component';

import { JobseekerListComponent } from './jobseeker-list-component/jobseeker-list-component';
// import { JobSeekerFormComponent } from './jobseeker-form-component/jobseeker-form-component';
// import { JobSeekerDetailComponent } from './jobseeker-detail-component/jobseeker-detail-component';
export const routes: Routes = [
    {path: '', redirectTo: '/employers', pathMatch: 'full' },
    { path: 'employers', component: EmployerList },
    { path: 'employers/new', component: EmployerFormComponent },
    { path: 'employers/:id', component: EmployerDetailComponent },
    
    { path: 'jobseekers', component: JobseekerListComponent },
    // { path: 'jobseekers/new', component: JobSeekerFormComponent },
    // { path: 'jobseekers/:id', component: JobSeekerDetailComponent },
    { path: '**', redirectTo: '/employers' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


