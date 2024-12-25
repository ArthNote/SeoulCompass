"use client";

import { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal, Trash } from "lucide-react";

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
import EditLocationDialog from "../../../../../components/admin/tourism/edit_location_dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import ViewLocationDialog from "@/components/admin/tourism/view_location_dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Location = {
  id: string;
  name: string;
  description: string;
  category:
    | "restaurant"
    | "hotel"
    | "attraction"
    | "bank"
    | "theater"
    | "bus_station";
  location: string;
  contact: string;
  rating: number;
  lat: number;
  lng: number;
};

export const columns: ColumnDef<Location>[] = [
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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      const rowValue = row.getValue(id) as string;
      return filterValues.includes(rowValue);
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const location = row.original;
      const { toast } = useToast();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Location ${data} copied to clipboard`,
        });
      };

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
                pathname: `/tourism/edit/${location.id}`,
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
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
