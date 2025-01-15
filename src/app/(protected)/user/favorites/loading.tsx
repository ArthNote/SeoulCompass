import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingFavorites() {
  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          <Skeleton className="h-9 w-full md:w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between flex-col md:flex-row w-full mb-4 gap-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(9).fill(0).map((_, i) => (
          <Card key={i} className="flex flex-col h-[220px]">
            <CardHeader className="flex-none pb-2">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-1 pt-0">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-full mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
