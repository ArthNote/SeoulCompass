import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background w-full">
      <div>
        <div className="container flex items-center justify-between h-16 px-0">
          <Link href="/user/student-resources">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              <div className="w-full flex gap-1">
                Back<span className="hidden sm:block">to Resources</span>
              </div>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Separator />
      </div>

      <div className="container py-6 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image Skeleton */}
            <Skeleton className="w-full h-[400px] rounded-lg" />

            {/* Tabs Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-2/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Skeletons */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </CardContent>
            </Card>

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
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />{" "}
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
