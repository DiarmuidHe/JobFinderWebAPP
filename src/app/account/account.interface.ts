export type AccountRole = 'jobseeker' | 'employer';

export interface JobseekerAccountDetails {
  role: 'jobseeker';
  name: string;
  email: string;
  skills: string[];
}

export interface EmployerAccountDetails {
  role: 'employer';
  companyName: string;
  contactEmail: string;
  description: string;
  location: string;
  logo: string | null;
}

export type AccountDetails = JobseekerAccountDetails | EmployerAccountDetails;

export interface AppliedJobItem {
  jobId: string;
  title?: string;
  jobTitle?: string;
  employerId?: string;
  employerName?: string;
  companyName?: string;
  appliedAt?: string;
  status?: string;
  location?: string;
}

export interface ApplicantItem {
  jobId: string;
  jobTitle?: string;
  title?: string;
  applicantId?: string;
  jobseekerId?: string;
  applicantName?: string;
  name?: string;
  applicantEmail?: string;
  email?: string;
  appliedAt?: string;
  status?: string;
}

export interface AccountUpdatePayload {
  name?: string;
  email?: string;
  skills?: string[];
  companyName?: string;
  contactEmail?: string;
  description?: string;
  location?: string;
  logo?: string | null;
  password?: string;
}
