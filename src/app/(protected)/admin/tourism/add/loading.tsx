import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Loading = () => {
  const renderSectionHeader = () => (
    <div className="flex items-center mb-4">
      <Skeleton className="h-6 w-[150px]" />
      <div className="flex-1 ml-4 border-t border-gray-200" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-[200px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-5 w-[300px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            {renderSectionHeader()}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            {renderSectionHeader()}
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            {renderSectionHeader()}
            <div className="space-y-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            {renderSectionHeader()}
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            {renderSectionHeader()}
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

          {/* Accessibility */}
          <div className="space-y-4">
            {renderSectionHeader()}
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <div className="grid gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Landmarks */}
          <div className="space-y-4">
            {renderSectionHeader()}
            {[1, 2].map((i) => (
              <div key={i} className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;
