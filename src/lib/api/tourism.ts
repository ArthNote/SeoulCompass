import {
  TourismType,
  PageResponse,
  Location,
  TourismPageParams,
} from "@/types/tourism";
import constants from "../../../constants";
import { access } from "fs";
import { create } from "domain";

export type TourismParams = {
  page?: number;
  size?: number;
  name?: string;
  types?: string[];
};

export const createTourism = async (
  tourism: TourismType
): Promise<TourismType> => {
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
    const response = await fetch(constants.api + "/tourism/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tourism),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating tourism:", error);
    throw error;
  }
};

export async function getTourism(
  params: TourismPageParams
): Promise<PageResponse<Location>> {
  const searchParams = new URLSearchParams();
  searchParams.append("page", params.page.toString());
  searchParams.append("size", params.size.toString());

  if (params.name) {
    searchParams.append("name", params.name);
  }
  if (params.types?.length) {
    params.types.forEach((type) => searchParams.append("types", type));
  }

  const response = await fetch(
    `${constants.api}/tourism/paginated?${searchParams.toString()}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tourism data");
  }
  return response.json();
}

export const deleteTourism = async (id: string): Promise<boolean> => {
  const response = await fetch(`${constants.api}/tourism/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data.deleted;
};

export const deleteBulkTourism = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${constants.api}/tourism/delete/bulk`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ids),
  });
  const data = await response.json();
  return data.deleted;
};

export const getTourismById = async (id: string): Promise<TourismType> => {
  const response = await fetch(`${constants.api}/tourism/id/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Network response was not ok");
  const data = await response.json();
  console.log(data);
  return data;
};

export const updateTourism = async (
  tourism: TourismType
): Promise<TourismType> => {
  const response = await fetch(
    `${constants.api}/tourism/update/${tourism.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tourism),
    }
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};
