"use client";
import { createContext, useContext } from "react";
import { useUser } from "@clerk/clerk-react";
import constants from "../../constants";
import { useQuery } from "@tanstack/react-query";

interface RoleContextType {
  role: string | null;
  isLoading: boolean;
  error: Error | null;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  isLoading: true,
  error: null,
});

async function fetchUserRole(userId: string) {
  const response = await fetch(`${constants.api}/users/clerkId/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user role");
  }

  const data = await response.json();
  return data.role;
}

export const RoleProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isLoaded: isUserLoaded } = useUser();

  const {
    data: role,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: () => (user?.id ? fetchUserRole(user.id) : null),
    enabled: !!user?.id && isUserLoaded,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 3,
  });

  return (
    <RoleContext.Provider
      value={{
        role: role ?? null,
        isLoading: isLoading || !isUserLoaded,
        error: error instanceof Error ? error : null,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
