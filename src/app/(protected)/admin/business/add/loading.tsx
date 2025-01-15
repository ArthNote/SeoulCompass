import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <div className="flex items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex-1 ml-4 border-t border-gray-200" />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-[200px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[300px]" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information */}
        <SectionSkeleton title="Basic Information" />

        {/* Location */}
        <SectionSkeleton title="Location" />

        {/* Contact Information */}
        <SectionSkeleton title="Contact Information" />

        {/* Social Media */}
        <SectionSkeleton title="Social Media" />

        {/* Opening Hours */}
        <SectionSkeleton title="Opening Hours" />

        {/* Features & Tags */}
        <SectionSkeleton title="Features & Tags" />

        {/* Photos */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Photos</h2>
            <div className="flex-1 ml-4 border-t border-gray-200" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>

        {/* Business Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Business Opportunities</h2>
            <div className="flex-1 ml-4 border-t border-gray-200" />
          </div>
          {['Mentorship Programs', 'Networking Events', 'Partnerships', 'Funding'].map((section) => (
            <div key={section} className="space-y-4 p-4 border rounded-lg">
              <Skeleton className="h-6 w-[150px]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* News & Updates */}
        <div className="space-y-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">News & Updates</h2>
            <div className="flex-1 ml-4 border-t border-gray-200" />
          </div>
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid gap-4">
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
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
