import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomPaginationProps<TData> {
  table: Table<TData>;
}

export function CustomPagination<TData>({
  table,
}: CustomPaginationProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <div className="inline-flex items-center rounded-lg border bg-card p-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center px-4 text-sm font-medium">
          <div className="text-muted-foreground">
            <span className="hidden sm:inline">Page </span>
            {table.getState().pagination.pageIndex + 1}
            <span className="mx-1">/</span>
            {table.getPageCount()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
