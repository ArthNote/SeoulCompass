import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-8 w-[200px]" /></CardTitle>
        <CardDescription><Skeleton className="h-5 w-[300px]" /></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Loading
