"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  SortingState,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "../../../../../components/table/pagination";
import { DataTableViewOptions } from "../../../../../components/table/column_toggle";
import { Delete, DeleteIcon, Plus, Settings2, Trash } from "lucide-react";
import CreateUserDialog from "../../../../../components/admin/users/create_user_dialog";
import AlertDialogDelete from "../../../../../components/shared/alert_dialog_delete";
import { DataTableFacetedFilter } from "../../../../../components/table/faceted_filter";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getJobs, deleteBulkJobs } from "@/lib/api/jobs";
import { toast } from "@/hooks/use-toast";
import JobsLoading from "../loading";
import { ErrorState } from "@/components/shared/error-state";
import Loading from "../add/loading";
import AdminJobsLoading from "../loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobType } from "@/types/job";

interface DataTableProps {
  columns: ColumnDef<JobType, any>[];
}

export function JobsTable({
  columns,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [salaryRange, setSalaryRange] = React.useState({ min: "", max: "" }); // Change initial state to strings

  // Add helper functions for input handling
  const handleSalaryInputChange = (field: "min" | "max", value: string) => {
    // Only allow numbers and empty string
    const sanitizedValue = value.replace(/[^\d]/g, "");
    setSalaryRange((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const applySalaryFilter = () => {
    const min = parseInt(salaryRange.min) || 0;
    const max = parseInt(salaryRange.max) || Infinity;
    table.getColumn("salary")?.setFilterValue(`${min}-${max}`);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "jobs",
      pageIndex,
      pageSize,
      columnFilters.find((f) => f.id === "title")?.value,
      columnFilters.find((f) => f.id === "industry")?.value,
      columnFilters.find((f) => f.id === "salary")?.value,
      columnFilters.find((f) => f.id === "type")?.value,
      columnFilters.find((f) => f.id === "workLocation")?.value,
      columnFilters.find((f) => f.id === "requirements.education")?.value,
    ],
    queryFn: () => {
      const salaryFilter = columnFilters.find((f) => f.id === "salary")
        ?.value as string;
      const [minSalary, maxSalary] = salaryFilter
        ? salaryFilter.split("-").map(Number)
        : [undefined, undefined];

      return getJobs({
        page: pageIndex,
        size: pageSize,
        title: columnFilters.find((f) => f.id === "title")?.value as string,
        industries: columnFilters.find((f) => f.id === "industry")
          ?.value as string[],
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
        workLocations: columnFilters.find((f) => f.id === "workLocation")
          ?.value as string[],
        educationLevels: columnFilters.find(
          (f) => f.id === "requirements.education"
        )?.value as string[],
        minSalary,
        maxSalary,
      });
    },
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteSelectedJobs } = useMutation({
    mutationFn: (ids: string[]) => deleteBulkJobs(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setRowSelection({});
      toast({
        title: "Success",
        description: "Selected jobs have been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete jobs. Please try again.",
        variant: "destructive",
      });
    },
  });

  const jobTypes = [
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Temporary", value: "temporary" },
    { label: "Internship", value: "internship" },
    { label: "Freelance", value: "freelance" },
  ];

  const workLocations = [
    { label: "On-site", value: "onsite" },
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
  ];

  const educationLevels = [
    { label: "None", value: "none" },
    { label: "High School", value: "high school" },
    { label: "Bachelor", value: "bachelor" },
    { label: "Master", value: "master" },
    { label: "PhD", value: "phd" },
  ];

  const table = useReactTable({
    data: data?.content || [], // Add fallback empty array
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableMultiRowSelection: true,
    pageCount: data?.totalPages ?? 0, // Add fallback 0
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize,
        });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  // Add data initialization check
  // if (!data) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[200px]">
  //       <p className="text-muted-foreground">No data available</p>
  //     </div>
  //   );
  // }

  if (isLoading) return <AdminJobsLoading />;
  if (isError)
    return (
      <ErrorState
        title="Error loading jobs"
        description="Failed to load jobs"
        retryAction={() => refetch()}
      />
    );

  const isFiltered = table.getState().columnFilters.length > 0;

  const industries = [
    { label: "Technology", value: "technology" },
    { label: "Finance", value: "finance" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Education", value: "education" },
    { label: "Retail", value: "retail" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Hospitality", value: "hospitality" },
    { label: "Construction", value: "construction" },
    { label: "Media", value: "media" },
    { label: "Transportation", value: "transportation" },
  ];

  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center pb-4 justify-between gap-4">
        <div className="flex items-start gap-2 w-full flex-col-reverse lg:flex-row lg:items-center">
          <Input
            placeholder="Filter titles..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="lg:max-w-sm w-full min-w-[148px]"
          />
          <div
            className={
              "w-full flex flex-wrap sm:flex-row items-center gap-2 " +
              (isFiltered ? "flex-wrap" : "")
            }
          >
            {table.getColumn("industry") && (
              <DataTableFacetedFilter
                column={table.getColumn("industry")}
                title="Industry"
                options={industries}
              />
            )}
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="Job Type"
                options={jobTypes}
              />
            )}
            {/* {table.getColumn("workLocation") && (
              <DataTableFacetedFilter
                column={table.getColumn("workLocation")}
                title="Work Location"
                options={workLocations}
              />
            )}
            {table.getColumn("requirements.education") && (
              <DataTableFacetedFilter
                column={table.getColumn("requirements.education")}
                title="Education"
                options={educationLevels}
              />
            )} */}
            {table.getColumn("salary") && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Salary Range
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Salary Range</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the minimum and maximum salary
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                          <Label htmlFor="minSalary">Min</Label>
                          <Input
                            id="minSalary"
                            placeholder="Min salary"
                            value={salaryRange.min}
                            onChange={(e) =>
                              handleSalaryInputChange("min", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="maxSalary">Max</Label>
                          <Input
                            id="maxSalary"
                            placeholder="Max salary"
                            value={salaryRange.max}
                            onChange={(e) =>
                              handleSalaryInputChange("max", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <Button
                        onClick={applySalaryFilter}
                        disabled={!salaryRange.min && !salaryRange.max}
                      >
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-row-reverse lg:flex-row">
          {Object.keys(rowSelection).length > 0 && (
            <AlertDialogDelete
              children={
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-auto h-8 transition-all duration-200 ease-in-out"
                >
                  <Trash />
                  Delete
                </Button>
              }
              title={
                Object.keys(rowSelection).length == 1
                  ? "Delete Job"
                  : `Delete ${Object.keys(rowSelection).length} Jobs`
              }
              description={
                Object.keys(rowSelection).length == 1
                  ? "Are you sure you want to delete this Job?"
                  : "Are you sure you want to delete these Jobs?"
              }
              onDelete={() => {
                const selectedJobs = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original as JobType);
                const jobIds = selectedJobs.map((job) => job.id);
                deleteSelectedJobs(jobIds);
              }}
            />
          )}
          <Link href="/admin/jobs/add">
            <Button variant="default" size="sm" className="ml-auto h-8">
              <Plus />
              Create
            </Button>
          </Link>

          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
