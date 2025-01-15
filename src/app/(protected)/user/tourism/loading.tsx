import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewTourismLoading = () => {
  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <div className="flex-wrap items-center gap-2 flex">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-start justify-between flex-col md:flex-row w-full mb-4 gap-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="list" disabled>List View</TabsTrigger>
            <TabsTrigger value="map" disabled>Map View</TabsTrigger>
          </TabsList>
          <Skeleton className="h-8 w-[200px]" />
        </div>

        <TabsContent value="list">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <Card key={index} className="flex flex-col h-[200px]">
                <CardHeader className="flex-none pb-2">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-12" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col justify-between flex-1 pt-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-8 w-full mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewTourismLoading;
