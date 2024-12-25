import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Loading() {
  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center pb-4 justify-between gap-4">
        <div className="flex items-start gap-2 w-full flex-col-reverse sm:flex-row sm:items-center">
          <Skeleton className="h-8 w-[150px] sm:w-[250px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-8 w-[100px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-[70px]" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
      </div>
    </div>
  )
}
