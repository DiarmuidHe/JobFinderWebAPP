import { Application } from "../aplications/application.interface";

export interface JobSeeker {
  _id?: string;
  name: string;
  email: string;
  hashedPassword?: string;
  password: string;
  skills: string[];
  applications: Application[];
}


