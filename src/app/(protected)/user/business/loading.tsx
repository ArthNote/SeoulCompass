import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessLoading() {
  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          {/* Search and filters skeleton */}
          <div className="relative w-full md:w-1/3">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-wrap items-center gap-2 flex">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      </div>

      {/* View toggle skeleton */}
      <div className="flex items-start justify-between flex-col md:flex-row w-full mb-4 gap-4">
        <Skeleton className="h-10 w-[400px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="flex flex-col h-[240px] p-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex-1 pt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
