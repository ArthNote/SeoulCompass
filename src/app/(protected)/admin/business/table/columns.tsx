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
import ViewBusinessDialog from "@/components/admin/business/view_business_dialog";
import { BusinessType } from "@/types/business";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusiness } from "@/lib/api/business";

export const columns: ColumnDef<BusinessType>[] = [
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
    cell: ({ row }) => {
      const type = row.original.type;
      return (type.charAt(0).toUpperCase() + type.slice(1)).replace("_", " ");
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const business = row.original;
      const { toast } = useToast();
      const queryClient = useQueryClient();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Business ${data} copied to clipboard`,
        });
      };

      const { mutate: deleteBusinesss } = useMutation({
        mutationFn: deleteBusiness,
        onSuccess: (data) => {
          console.log("Business deleted successfully:", data);
          queryClient.invalidateQueries({ queryKey: ["businesses"] });
          toast({
            title: "Success",
            description: "Business deleted successfully.",
          });
        },
        retry: 3,
        onError: (error, variables) => {
          console.error("Error deleting business:", error);
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
            <ViewBusinessDialog business={business} />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => copyToClipboard(business.id, "ID")}
            >
              Copy business ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              href={{
                pathname: `/admin/business/edit/${business.id}`,
              }}
            >
              <DropdownMenuItem>Edit Business</DropdownMenuItem>
            </Link>
            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete Business
                </DropdownMenuItem>
              }
              title="Delete Business"
              description="Are you sure you want to delete this business?"
              onDelete={() => deleteBusinesss(business.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
