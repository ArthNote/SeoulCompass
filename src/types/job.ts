export type JobType = {
  id: string;
  title: string;
  description: string;
  industry:
    | "technology"
    | "finance"
    | "healthcare"
    | "education"
    | "retail"
    | "manufacturing"
    | "hospitality"
    | "construction"
    | "media"
    | "transportation";
  type:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "internship"
    | "freelance";
  workLocation: "onsite" | "remote" | "hybrid";
  requirements: {
    education: "none" | "high school" | "bachelor" | "master" | "phd";
    experience: number;
    skills: string[];
  };
  workSchedule: {
    workdays: {
      from:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
      to:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday";
    };
    workhours: {
      from: string;
      to: string;
    };
  };
  benefits: string[];
  salary: {
    salary: string;
    min: number;
    max: number;
    period: "monthly" | "yearly";
  };
  contact: string;
  createdAt: string;
  deadline: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  company: {
    name: string;
    industry: string;
    description: string;
    employees: number;
    website: string;
  };
};
