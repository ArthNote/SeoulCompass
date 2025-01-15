import { Skeleton } from "@/components/ui/skeleton";
import { CardWrapper } from "@/components/auth/card_wrapper";

export default function Loading() {
  return (
    <div className="m-16 w-full">
      <CardWrapper
        headerTitle="Sign In"
        backButtonLabel="Don't have an account?"
        backButtonHref="/signup"
      >
        <div className="space-y-4 w-full">
          {/* Form fields skeleton */}
          <div className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
              {/* Forgot password link */}
              <div className="flex justify-start">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>

            {/* Submit button */}
            <Skeleton className="h-10 w-full mt-4 rounded-md" />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center justify-center w-full h-10 border rounded-md">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center justify-center w-full h-10 border rounded-md">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
}
