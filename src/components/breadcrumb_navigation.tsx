"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const BreadcrumbNavigation = () => {
  const router = usePathname();
  const pathSegments = router.split("/").filter(Boolean);
  
  // Filter out "admin" from display segments but keep for href
  const displaySegments = pathSegments.filter(segment => segment !== "admin");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {displaySegments.map((segment, index) => {
          const isLast = index === displaySegments.length - 1;
          const formatedSegment =
            segment.charAt(0).toUpperCase() + segment.slice(1);
          // Keep admin in the href if it exists in original path
          const href = "/" + pathSegments.slice(0, pathSegments.indexOf(segment) + 1).join("/");

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatedSegment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{formatedSegment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation;
