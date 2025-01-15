import { StudentResource } from "@/types/student-resource";
import constants from "../../../constants";

export type StudentResourcesParams = {
  page?: number;
  size?: number;
  name?: string;
  types?: string[];
};

export type StudentResourcesResponse = {
  content: StudentResource[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const getStudentResources = async ({
  page = 0,
  size = 10,
  name,
  types,
}: StudentResourcesParams): Promise<StudentResourcesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(name && { name }),
  });

  // Add multiple types if they exist
  if (types && types.length > 0) {
    types.forEach((type) => params.append("types", type));
  }

  const response = await fetch(
    `${constants.api}/resources/paginated?${params}`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const deleteBulkStudentResources = async (
  ids: string[]
): Promise<boolean> => {
  const response = await fetch(`${constants.api}/resources/delete/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  const data = await response.json();
  return data.deleted;
};

export const deleteStudentResource = async (id: string): Promise<boolean> => {
  const response = await fetch(`${constants.api}/resources/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.deleted;
};

export const createStudentResource = async (
  resource: StudentResource
): Promise<StudentResource> => {
  try {
    // const payload = {
    //   name: tourism.name,
    //   description: tourism.description,
    //   location: tourism.location,
    //   photos: tourism.photos,
    //   accessibility: tourism.accessibility,
    //   type: tourism.type,
    //   rating: tourism.rating,
    //   contact: tourism.contact,
    //   openingHours: tourism.openingHours,
    //   createdAt: tourism.createdAt,
    //   landmarks: tourism.landmarks,
    //   userRatingCount: tourism.userRatingCount,
    // };
    const response = await fetch(constants.api + "/resources/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating resource:", error);
    throw error;
  }
};

export const getStudentResourceById = async (id: string): Promise<StudentResource> => {
  const response = await fetch(`${constants.api}/resources/id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};


export const updateStudentResource = async (
  resource: StudentResource
): Promise<StudentResource> => {
  const response = await fetch(
    `${constants.api}/resources/update/${resource.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resource),
    }
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};