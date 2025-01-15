import { JobType } from "@/types/job";
import constants from "../../../constants";

export type JobsParams = {
  page?: number;
  size?: number;
  title?: string;
  industries?: string[];
  minSalary?: number;
  maxSalary?: number;
  types?: string[];
  workLocations?: string[];
  educationLevels?: string[];
};

export type JobsResponse = {
  content: JobType[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const createJob = async (job: JobType): Promise<JobType> => {
  try {
    const response = await fetch(constants.api + "/jobs/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const getJobs = async ({
  page = 0,
  size = 10,
  title,
  industries,
  minSalary,
  maxSalary,
  types,
  workLocations,
  educationLevels,
}: JobsParams): Promise<JobsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(title && { title }),
    ...(minSalary && { minSalary: minSalary.toString() }),
    ...(maxSalary && { maxSalary: maxSalary.toString() }),
  });

  if (industries?.length) {
    industries.forEach((industry) => params.append("industries", industry));
  }
  if (types?.length) {
    types.forEach((type) => params.append("types", type));
  }
  if (workLocations?.length) {
    workLocations.forEach((loc) => params.append("workLocations", loc));
  }
  if (educationLevels?.length) {
    educationLevels.forEach((edu) => params.append("educationLevels", edu));
  }

  const response = await fetch(`${constants.api}/jobs/paginated?${params}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const deleteJob = async (id: string): Promise<boolean> => {
  const response = await fetch(`${constants.api}/jobs/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data.deleted;
};

export const deleteBulkJobs = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${constants.api}/jobs/delete/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  const data = await response.json();
  return data.deleted;
};

export const getJobById = async (id: string): Promise<JobType> => {
  const response = await fetch(`${constants.api}/jobs/id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const updateJob = async (job: JobType): Promise<JobType> => {
  const response = await fetch(`${constants.api}/jobs/update/${job.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(job),
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};
