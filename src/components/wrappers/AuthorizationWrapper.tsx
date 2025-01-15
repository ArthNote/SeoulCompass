"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRole } from "@/hooks/use_role";
import { Toaster } from "@/components/ui/toaster";

const AuthorizationWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { role, isLoading } = useRole();
  const [isNavigating, setIsNavigating] = useState(false);

  const publicRoutes = ["/signin", "/signup", "/privacy", "/terms", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = pathname.startsWith("/user");

  useEffect(() => {
    if (isLoading || !isUserLoaded || isNavigating) return;

    const handleNavigation = async () => {
      let targetPath: string | null = null;

      if (!user && !isPublicRoute) {
        targetPath = "/signin";
      } else if (user && !role && !isPublicRoute) {
        targetPath = "/error";
      } else if (role === "admin" && !isAdminRoute && !isPublicRoute) {
        targetPath = "/admin/dashboard";
      } else if (role === "user" && !isUserRoute && !isPublicRoute) {
        targetPath = "/user/tourism";
      } else if (isPublicRoute && role) {
        targetPath = role === "admin" ? "/admin/dashboard" : "/user/tourism";
      }

      if (targetPath && targetPath !== pathname) {
        setIsNavigating(true);
        await router.push(targetPath);
        setTimeout(() => setIsNavigating(false), 300);
      }
    };

    handleNavigation();
  }, [isLoading, isUserLoaded, user, role, pathname]);

  if (isLoading || !isUserLoaded || isNavigating) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {children} <Toaster />{" "}
    </>
  );
};

export default AuthorizationWrapper;
