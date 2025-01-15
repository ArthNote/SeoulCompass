import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessDetailLoading() {
  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <div>
        <div className="container flex items-center justify-between h-16 px-0">
          <Skeleton className="h-9 w-[100px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <Separator />
      </div>

      <div className="container py-6 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-6 w-[80px]" />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="photos" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                {Array(4).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </TabsList>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array(6).fill(null).map((_, i) => (
                      <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-[150px]" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array(5).fill(null).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-[100px]" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-[150px]" /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[100px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact & Social */}
            <Card>
              <CardHeader>
                <CardTitle><Skeleton className="h-6 w-[150px]" /></CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-5 w-[200px]" />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
