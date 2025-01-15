import { BusinessType } from "@/types/business";
import constants from "../../../constants";

export type BusinessParams = {
  page?: number;
  size?: number;
  name?: string;
  types?: string[]; // Changed from type to types array
};

export type BusinessResponse = {
  content: BusinessType[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const createBusiness = async (
  business: BusinessType
): Promise<BusinessType> => {
  try {
    const response = await fetch(`${constants.api}/business/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(business),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating business:", error);
    throw error;
  }
};

export const getBusinesses = async (
  params: BusinessParams
): Promise<BusinessResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", (params.page ?? 0).toString());
  searchParams.append("size", (params.size ?? 10).toString());

  if (params.name) {
    searchParams.append("name", params.name);
  }
  if (params.types?.length) {
    params.types.forEach((type) => searchParams.append("types", type)); // Changed to handle multiple types
  }

  const response = await fetch(
    `${constants.api}/business/paginated?${searchParams.toString()}`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  console.log(data);
  return data;
};

export const deleteBusiness = async (id: string): Promise<boolean> => {
  const response = await fetch(`${constants.api}/business/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data.deleted;
};

export const deleteBulkBusinesses = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${constants.api}/business/delete/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  const data = await response.json();
  return data.deleted;
};

export const getBusinessById = async (id: string): Promise<BusinessType> => {
  const response = await fetch(`${constants.api}/business/id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const updateBusiness = async (business: BusinessType): Promise<BusinessType> => {
  try {
    console.log('Sending update request for business:', business); // Debug log
    
    const response = await fetch(`${constants.api}/business/update/${business.id}`, { // Changed from businesses to business
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(business),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update business error response:', errorText); // Error log
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Update business response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

// Add other business API functions as needed
