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
import ViewJobDialog from "@/components/admin/jobs/view_job_dialog";
import { JobType } from "@/types/job";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJob } from "@/lib/api/jobs";

export const columns: ColumnDef<JobType>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => {
      const industry = row.original.industry;
      return industry.charAt(0).toUpperCase() + industry.slice(1);
    },
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <span>
          {[type]
            .map((t) =>
              t
                .replace(/-/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            )
            .join(", ")}
        </span>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;

      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "workLocation",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Work Location" />
  //   ),
  //   filterFn: (row, id, value: string[]) => {
  //     if (!value?.length) return true;
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "requirements",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Education" />
  //   ),
  //   cell: ({ row }) => {
  //     const education = row.original.requirements.education;
  //     return education;
  //   },
  //   filterFn: (row, id, value: string) => {
  //     const education = row.original.requirements.education;

  //     if (!value) return true;
  //     return education === value;
  //   },
  // },
  {
    id: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary = row.original.salary;
      return (
        <div>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(salary.min)}
          {" - "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(salary.max)}
        </div>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      if (!value) return true;
      const salary = row.original.salary;
      const minSalary = salary.min;
      const maxSalary = salary.max;

      const [filterMin, filterMax] = value.split("-").map((v: string) => {
        if (v === "Infinity") return Infinity;
        return parseInt(v, 10);
      });

      if (filterMax === Infinity) {
        return minSalary >= filterMin;
      }
      return minSalary >= filterMin && maxSalary <= filterMax;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original;
      const queryClient = useQueryClient();
      const { toast } = useToast();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Job ${data} copied to clipboard`,
        });
      };

      const {
        mutate: deleteJobb,
        isError,
        error,
      } = useMutation({
        mutationFn: deleteJob,

        onSuccess: (data) => {
          console.log("Job deleted successfully:", data);
          queryClient.invalidateQueries({ queryKey: ["jobs"] });
          toast({
            title: "Success",
            description: "Job deleted successfully.",
          });
        },
        retry: 3,
        onError: (error, variables) => {
          console.error("Error deleting job:", error);
          console.error(JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: "Failed to delete job. Please try again.",
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
            <ViewJobDialog job={job} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => copyToClipboard(job.id, "ID")}>
              Copy job ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              href={{
                pathname: `/admin/jobs/edit/${job.id}`,
              }}
            >
              <DropdownMenuItem>Edit Job</DropdownMenuItem>
            </Link>{" "}
            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete Job
                </DropdownMenuItem>
              }
              title="Delete Job"
              description="Are you sure you want to delete this Job?"
              onDelete={() => deleteJobb(job.id)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
