import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  // Create array for info cards
  const infoCards = Array(5).fill(0);

  return (
    <div className="flex flex-col gap-5">
      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {infoCards.map((_, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-7 w-[60px]" />
            <Skeleton className="h-3 w-full" />
          </Card>
        ))}
      </div>

      {/* Users Chart Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-4 w-[260px]" />
          </div>
          <Skeleton className="h-8 w-[140px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>

      {/* Bottom Section */}
      <div className="w-full flex flex-col gap-5 h-fit lg:flex-row">
        {/* Latest Users Card */}
        <Card className="w-full lg:w-1/2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        </Card>

        {/* Modules Visitors Chart Card */}
        <Card className="w-full lg:w-1/2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[140px]" />
              <Skeleton className="h-4 w-[240px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-[130px]" />
              <Skeleton className="h-8 w-[130px]" />
            </div>
          </div>
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </div>
    </div>
  );
}
