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
import { UserType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClerkUser, deleteUser } from "@/lib/api/users";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UserType>[] = [
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
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
    cell: ({ row }) => {
      const role = row.original.role;
      return <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      // If no filters are selected, show all rows
      if (!filterValues?.length) return true;
      const rowValue = row.getValue(id) as string;
      // Check if the row's role is included in the selected filter values

      return filterValues.includes(rowValue.toLowerCase());
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const queryClient = useQueryClient();
      const user = row.original;
      const { toast } = useToast();

      const copyToClipboard = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: type + " ID copied to clipboard",
        });
      };

      const {
        mutate: deleteUserr,
        isError,
        error,
      } = useMutation({
        mutationFn: ({
          userId,
          clerkId,
        }: {
          userId: string;
          clerkId: string;
        }) => deleteUser(userId, clerkId),

        onSuccess: (data) => {
          console.log("User deleted successfully:", data);
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast({
            title: "Success",
            description: "User deleted successfully.",
          });
        },
        retry: 3,
        onError: (error, variables) => {
          console.error("Error deleting user:", error);
          console.error(JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: "Failed to delete user. Please try again.",
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
            <DropdownMenuItem onClick={() => copyToClipboard(user.id, "User")}>
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => copyToClipboard(user.clerkId, "Clerk")}
            >
              Copy clerk ID
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
              onDelete={() =>
                deleteUserr({
                  userId: user.id,
                  clerkId: user.clerkId,
                })
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
