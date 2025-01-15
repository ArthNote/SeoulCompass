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
import { Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getBusinesses, deleteBulkBusinesses } from "@/lib/api/business";
import { toast } from "@/hooks/use-toast";
import { ErrorState } from "@/components/shared/error-state";
import AdminBusinessLoading from "../loading";
import { BusinessType } from "@/types/business";

interface DataTableProps {
  columns: ColumnDef<BusinessType, any>[];
}

export function BusinessTable({ columns }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "businesses",
      pageIndex,
      pageSize,
      columnFilters.find((f) => f.id === "name")?.value,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getBusinesses({
        page: pageIndex,
        size: pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as string,
        types: columnFilters.find((f) => f.id === "type")?.value as string[], // Changed to handle array
      }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();

  const { mutate: deleteSelectedBusinesses } = useMutation({
    mutationFn: (ids: string[]) => deleteBulkBusinesses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setRowSelection({});
      toast({
        title: "Success",
        description: "Selected businesses have been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete businesses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const table = useReactTable({
    data: (data?.content || []) as BusinessType[],
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
    pageCount: data?.totalPages ?? 0,
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

  if (isLoading) return <AdminBusinessLoading />;
  if (isError)
    return (
      <ErrorState
        title="Error loading businesses"
        description="Failed to load businesses"
        retryAction={() => refetch()}
      />
    );

  const isFiltered = table.getState().columnFilters.length > 0;

  const types = [
    // Changed from categories to types
    {
      label: "Business Center",
      value: "business_center",
    },
    {
      label: "Industry",
      value: "industry",
    },
    {
      label: "Event",
      value: "event",
    },
    {
      label: "Opportunity",
      value: "opportunity",
    },
  ];

  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center pb-4 justify-between gap-4">
        <div className="flex items-start gap-2 w-full flex-col-reverse sm:flex-row sm:items-center">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="sm:max-w-sm w-full"
          />
          <div className="w-fit flex items-center">
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="Type"
                options={types}
              />
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

        <div className="flex items-center gap-2 flex-row-reverse sm:flex-row">
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
                  ? "Delete Business"
                  : `Delete ${Object.keys(rowSelection).length} Businesss`
              }
              description={
                Object.keys(rowSelection).length == 1
                  ? "Are you sure you want to delete this business?"
                  : "Are you sure you want to delete these businesses?"
              }
              onDelete={() => {
                const selectedItems = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original as BusinessType);
                const ids = selectedItems.map((item) => item.id);
                deleteSelectedBusinesses(ids);
              }}
            />
          )}
          <Link href="/admin/business/add">
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
