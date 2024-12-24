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
import EditUserDialog from "../../../../../components/admin/users/edit_user_dialog";
import { useToast } from "@/hooks/use-toast";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      const rowValue = row.getValue(id) as string;
      return filterValues.includes(rowValue);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const { toast } = useToast();

      const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: "User ID copied to clipboard",
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
            <DropdownMenuItem onClick={() => copyToClipboard(user.id)}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <EditUserDialog
              child={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit User
                </DropdownMenuItem>
              }
              user={user}
            />

            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete User
                </DropdownMenuItem>
              }
              title="Delete User"
              description="Are you sure you want to delete this user?"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
