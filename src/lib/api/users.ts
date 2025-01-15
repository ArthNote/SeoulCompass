import { UserType } from "@/types/user";
import constants from "../../../constants";

export type UsersParams = {
  page?: number;
  size?: number;
  name?: string;
  role?: string[];
};

export const getUsers = async ({
  page = 0,
  size = 10,
  name,
  role,
}: UsersParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    ...(name && { name }),
  });

  // Add multiple roles if they exist
  if (role && role.length > 0) {
    role.forEach((r) => params.append("role", r));
  }

  const response = await fetch(
    `http://localhost:8081/api/users/paginated?${params}`
  );
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const createUser = async (user: UserType): Promise<UserType> => {
  try {
    const userPayload = {
      username: user.username,
      email: user.email,
      role: user.role,
      clerkId: user.clerkId,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };
    const response = await fetch(constants.api + "/users/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const deleteClerkUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/delete-user?userId=${userId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      console.error("Error deleting user:", data.error);
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred.");
  }
};

export const createClerkUser = async (
  email: string,
  username: string,
  password: string
): Promise<string> => {
  try {
    const response = await fetch(
      `/api/create-user?username=${username}&email=${email}&password=${password}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();

    if (response.ok) {
      return data.clerkId;
    } else {
      console.error("Error creating user: ", data.error);
      alert(`Error: ${data.error}`);
      return "";
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred.");
    return "";
  }
};

export const deleteUser = async (
  userId: string,
  clerkId: string
): Promise<boolean> => {
  try {
    const response = await fetch(constants.api + "/users/delete/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (response.ok) {
      await deleteClerkUser(clerkId);
      return true;
    } else {
      console.error("Error deleting user:", data.error);
      alert(`Error: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred.");
    return false;
  }
};

export const updateClerkUser = async (
  email: string,
  username: string,
  id: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `/api/update-user?username=${username}&email=${email}&clerkId=${id}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();

    if (response.ok) {
      return true;
    } else {
      console.error("Error updating user: ", data.error);
      alert(`Error: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("An unexpected error occurred.");
    return false;
  }
};

export const updateUser = async (user: UserType): Promise<boolean> => {
  try {
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      clerkId: user.clerkId,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };
    const response = await fetch(constants.api + "/users/update/" + user.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${errorText}`);
    } else {
      updateClerkUser(user.email, user.username, user.clerkId);
      return true;
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteBulkUsers = async (users: UserType[]): Promise<boolean> => {
  try {
    // Delete from database first
    const userIds = users.map((user) => user.id);
    const response = await fetch(`${constants.api}/users/delete/bulk`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userIds),
    });

    if (!response.ok) {
      throw new Error("Failed to delete users from database");
    }

    // Then delete from Clerk
    await Promise.all(users.map((user) => deleteClerkUser(user.clerkId)));

    return true;
  } catch (error) {
    console.error("Error deleting users:", error);
    throw error;
  }
};
