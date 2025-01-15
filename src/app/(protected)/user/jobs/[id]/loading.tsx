import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div>
        <div className="container flex items-center justify-between h-16 px-0">
          <Link href="/user/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              <div className="w-full flex gap-1">
                Back<span className="hidden sm:block">to Jobs</span>
              </div>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[70px]" />
            <Skeleton className="h-9 w-[70px]" />
          </div>
        </div>
        <Separator />
      </div>

      <div className="container py-6 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-[250px]" />
                      <Skeleton className="h-6 w-[100px]" />
                    </div>
                    <Skeleton className="h-5 w-[200px]" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-5 w-[180px]" />
                    <Skeleton className="h-5 w-[150px]" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Skeleton className="h-7 w-[150px]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-[150px]" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-[120px]" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[100px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-[160px]" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-5 w-[150px]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
