import { FavoriteType } from "@/types/favorite";
import constants from "../../../constants";

export type FavoriteParams = {
  page?: number;
  size?: number;
  name?: string;
  types?: string[];
  userId: string;
};

export type FavoritesResponse = {
  content: FavoriteType[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export const createFavorite = async (
  fav: FavoriteType
): Promise<FavoriteType> => {
  try {
    const response = await fetch(constants.api + "/favorites/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fav),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating favorite:", error);
    throw error;
  }
};

export const getFavorites = async ({
  page = 0,
  size = 9,
  name,
  types,
  userId,
}: FavoriteParams): Promise<FavoritesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    userId: userId,
    ...(name && { name }),
  });

  if (types?.length) {
    types.forEach((type) => params.append("types", type));
  }

  const response = await fetch(
    `${constants.api}/favorites/paginated?${params}`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const deleteFavorite = async (id: string): Promise<boolean> => {
  const response = await fetch(`${constants.api}/favorites/delete/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data.deleted;
};

export const deleteFavoriteByItemId = async (
  itemId: string,
  userId: string
): Promise<boolean> => {
  const params = new URLSearchParams({
    userId: userId,
  });
  const response = await fetch(
    `${constants.api}/favorites/delete-by-item/${itemId}?${params}`,
    {
      method: "DELETE",
    }
  );
  const data = await response.json();
  return data.deleted;
};

export const favoriteExists = async (id: string, userId: string): Promise<boolean> => {
  const params = new URLSearchParams({
    userId: userId,
  });
  const response = await fetch(`${constants.api}/favorites/exists/${id}?${params}`, {
    method: "GET",
  });
  const data = await response.json();
  return data.exists;
};
