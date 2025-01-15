"use client";

// ...existing imports...
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getTourism, deleteBulkTourism } from "@/lib/api/tourism";
import { toast } from "@/hooks/use-toast";
import { TourismType } from "@/types/tourism";
import AdminTourismLoading from "../loading";
import { ErrorState } from "@/components/shared/error-state";

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
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function TourismTable({
  columns,
}: DataTableProps<TourismType, any>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "tourism",
      pageIndex,
      pageSize,
      columnFilters.find((f) => f.id === "name")?.value,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getTourism({
        page: pageIndex,
        size: pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as string,
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteSelectedTourism } = useMutation({
    mutationFn: (ids: string[]) => deleteBulkTourism(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
      setRowSelection({});
      toast({
        title: "Success",
        description: "Selected locations have been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete locations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const table = useReactTable({
    data: (data?.content || []) as TourismType[],
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

  if (isLoading) return <AdminTourismLoading />;
  if (isError)
    return (
      <ErrorState
        title="Error loading locations"
        description="Failed to load locations"
        retryAction={() => refetch()}
      />
    );

  const isFiltered = table.getState().columnFilters.length > 0;

  const types = [
    { label: "Amusement Park", value: "amusement_park" },
    { label: "Aquarium", value: "aquarium" },
    { label: "Art Gallery", value: "art_gallery" },
    { label: "Museum", value: "museum" },
    { label: "Park", value: "park" },
    { label: "Tourist Attraction", value: "tourist_attraction" },
    { label: "Zoo", value: "zoo" },
    { label: "Embassy", value: "embassy" },
    { label: "Fire Station", value: "fire_station" },
    { label: "Police", value: "police" },
    { label: "Gym", value: "gym" },
    { label: "Pharmacy", value: "pharmacy" },
    { label: "Hospital", value: "hospital" },
    { label: "Train Station", value: "train_station" },
    { label: "Subway Station", value: "subway_station" },
    { label: "Bus Station", value: "bus_station" },
    { label: "Taxi Stand", value: "taxi_stand" },
    { label: "Parking", value: "parking" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Cafe", value: "cafe" },
    { label: "Supermarket", value: "supermarket" },
    { label: "Bank", value: "bank" },
    { label: "ATM", value: "atm" },
    { label: "Shopping Mall", value: "shopping_mall" },
    { label: "Lodging", value: "lodging" },
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
                  ? "Delete Location"
                  : `Delete ${Object.keys(rowSelection).length} Locations`
              }
              description={
                Object.keys(rowSelection).length == 1
                  ? "Are you sure you want to delete this location?"
                  : "Are you sure you want to delete these locations?"
              }
              onDelete={() => {
                const selectedLocations = table
                  .getFilteredSelectedRowModel()
                  .rows.map((row) => row.original as TourismType);
                const ids = selectedLocations.map((item) => item.id);
                deleteSelectedTourism(ids);
              }}
            />
          )}
          <Link href="/admin/tourism/add">
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
