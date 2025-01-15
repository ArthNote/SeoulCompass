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
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import ViewStudentDialog from "@/components/admin/student/view_student_dialog";
import { StudentResource } from "@/types/student-resource";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentResource } from "@/lib/api/student-resources";

export const columns: ColumnDef<StudentResource>[] = [
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
      <DataTableColumnHeader column={column} title="Type" />
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
    cell: ({ row }) => {
      const location = row.original.location;
      return <span>{location.address}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const resource = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Resource ${data} copied to clipboard`,
        });
      };

      const {
        mutate: deleteResource,
        isError,
        error,
      } = useMutation({
        mutationFn: deleteStudentResource,

        onSuccess: (data) => {
          console.log("Resource deleted successfully:", data);
          queryClient.invalidateQueries({ queryKey: ["student-resources"] });
          toast({
            title: "Success",
            description: "Resource deleted successfully.",
          });
        },
        retry: 3,
        onError: (error, variables) => {
          console.error("Error deleting Resource:", error);
          console.error(JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: "Failed to delete Resource. Please try again.",
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
            <ViewStudentDialog resource={resource} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => copyToClipboard(resource.id, "ID")}
            >
              Copy resource ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              href={{
                pathname: `/admin/student-resources/edit/${resource.id}`,
              }}
            >
              <DropdownMenuItem>Edit Resource</DropdownMenuItem>
            </Link>{" "}
            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete Resource
                </DropdownMenuItem>
              }
              title="Delete Resource"
              description="Are you sure you want to delete this student resource?"
              onDelete={() => deleteResource(resource.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
