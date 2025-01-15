"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal, Star, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { DataTableColumnHeader } from "../../../../../components/table/column_header";
import AlertDialogDelete from "../../../../../components/shared/alert_dialog_delete";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import ViewLocationDialog from "@/components/admin/tourism/view_location_dialog";
import { TourismType } from "@/types/tourism";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTourism } from "@/lib/api/tourism";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TourismType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span>
          {[type]
            .map((t) =>
              t
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            )
            .join(", ")}
        </span>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      const rowValue = row.getValue(id) as string;
      return filterValues.includes(rowValue);
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),

    // cell: ({ row }) => {
    //   const description = row.original.description;
    //   return (
    //     <span className="truncate block max-w-[70px] md:max-w-[100px]">
    //       {description}
    //     </span>
    //   );
    // },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const location = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Location ${data} copied to clipboard`,
        });
      };

      const {
        mutate: deleteLocation,
        isError,
        error,
      } = useMutation({
        mutationFn: deleteTourism,

        onSuccess: (data) => {
          console.log("Location deleted successfully:", data);
          queryClient.invalidateQueries({ queryKey: ["tourism"] });
          toast({
            title: "Success",
            description: "Location deleted successfully.",
          });
        },
        retry: 3,
        onError: (error, variables) => {
          console.error("Error deleting Location:", error);
          console.error(JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: "Failed to delete Location. Please try again.",
          });
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <ViewLocationDialog location={location} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => copyToClipboard(location.id, "ID")}
            >
              Copy location ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              href={{
                pathname: `/admin/tourism/edit/${location.id}`,
              }}
            >
              <DropdownMenuItem>Edit Location</DropdownMenuItem>
            </Link>{" "}
            {/* <EditLocationDialog
              child={<DropdownMenuItem>Edit Location</DropdownMenuItem>}
              location={location}
            /> */}
            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete Location
                </DropdownMenuItem>
              }
              title="Delete Location"
              description="Are you sure you want to delete this location?"
              onDelete={() => deleteLocation(location.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
