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

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const formatedSegment =
            segment.charAt(0).toUpperCase() + segment.slice(1);
          const href = "/" + pathSegments.slice(0, index + 1).join("/");

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
