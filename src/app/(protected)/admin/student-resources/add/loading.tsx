import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[400px]" />
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px] mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Opening Hours */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-5 w-[120px]" />
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-10 w-full" />
                  <span>-</span>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Features Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[220px] mb-4" />
          <div className="grid gap-6">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-[120px] mb-4" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-md" />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export default Loading;
