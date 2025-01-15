import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewTourismLoading = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      {/* Sticky Navigation */}
      <div>
        <div className="container flex items-center justify-between h-16 px-0">
          <Skeleton className="h-9 w-[100px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[80px]" />
            <Skeleton className="h-9 w-[80px]" />
          </div>
        </div>
        <Separator />
      </div>

      <div className="container py-6 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Skeleton */}
            <Skeleton className="w-full h-[400px] rounded-lg" />

            {/* Tabs Skeleton */}
            <Tabs defaultValue="list" className="w-full">
              <div className="space-y-4">
                <TabsList>
                  {["About", "Reviews", "Map"].map((tab) => (
                    <TabsTrigger key={tab} value={tab} disabled>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Content Card Skeleton */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sections */}
                {[1, 2, 3].map((section) => (
                  <div key={section} className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    {[1, 2].map((item) => (
                      <div key={item} className="flex justify-between pl-6">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                    {section !== 3 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTourismLoading;
