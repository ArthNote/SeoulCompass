import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20 w-full">
      {/* Hero Section Skeleton */}
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-20 w-full max-w-3xl" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <Skeleton className="h-12 w-40 rounded-md mt-5" />
      </div>

      {/* Seoul Image Skeleton */}
      <div className="pb-6 sm:pb-16 pt-10 px-3 sm:px-0 w-full">
        <Skeleton className="w-full aspect-video rounded-xl" />
      </div>

      {/* About Us Section Skeleton */}
      <div className="overflow-hidden ">
        <div className="mx-auto px-6 lg:px-0">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <Skeleton className="h-10 w-3/4 mb-6" />
                <Skeleton className="h-24 w-full" />
                <div className="mt-10 space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative pl-9">
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Skeleton className="aspect-square rounded-full" />
          </div>
        </div>
      </div>

      {/* Key Features Section Skeleton */}
      <div className="pb-6 pt-28 px-6">
        <div className="text-center">
          <Skeleton className="h-8 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-full max-w-xl mx-auto mb-4" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 px-6 sm:px-0">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Why Choose Us Section Skeleton */}
      <section className="py-28 px-6">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-full max-w-xl mx-auto mb-4" />
          <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        </div>

        <div className="grid grid-cols-6 gap-3 px-6 sm:px-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              className="col-span-full lg:col-span-2 h-64 rounded-2xl"
            />
          ))}
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section>
        <div className="container flex flex-col gap-10 pb-28 sm:gap-y-16 px-6 sm:px-0 mx-0">
          <div className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-full max-w-xl mx-auto mb-4" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>

          <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="break-inside-avoid mb-5">
                <Skeleton className="h-48 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Loading;
