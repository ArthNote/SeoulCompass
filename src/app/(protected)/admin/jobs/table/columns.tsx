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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Job = {
  id: string;
  title: string;
  company: string;
  industry:
    | "technology"
    | "finance"
    | "healthcare"
    | "education"
    | "retail"
    | "manufacturing"
    | "hospitality"
    | "construction"
    | "media"
    | "transportation";
  description: string;
  salary: string;
  contact: string;
  location: string;
};

export const columns: ColumnDef<Job>[] = [
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
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      const rowValue = row.getValue(id) as string;
      return filterValues.includes(rowValue);
    },
  },
  // {
  //   accessorKey: "min_salary",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Min Salary" />
  //   ),
  //   cell: ({ row }) => {
  //     const min = parseFloat(row.getValue("min_salary"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(min);
  //     return <div>{formatted}</div>;
  //   },
  //   enableColumnFilter: true,
  //   filterFn: (row, id, filterValues: string[]) => {
  //     if (!filterValues?.length) return true;
  //     const minSalary = row.getValue("min_salary") as number;
  //     const maxSalary = row.getValue("max_salary") as number;

  //     return filterValues.some((range) => {
  //       const [min, max] = range.split("-").map(Number);
  //       if (range === "7000-plus") {
  //         return minSalary >= 7000 || maxSalary >= 7000;
  //       }
  //       // Check if either min or max salary falls within the range
  //       return (
  //         (minSalary >= min && minSalary <= max) ||
  //         (maxSalary >= min && maxSalary <= max) ||
  //         (minSalary <= min && maxSalary >= max)
  //       );
  //     });
  //   },
  // },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const salary = row.getValue("salary") as string;
      const [min, max] = salary.split("-").map(Number);
      const formattedMin = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(min);
      const formattedMax = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(max);
      return <div>{formattedMin + " - " + formattedMax}</div>;
    },
    enableColumnFilter: true,
    filterFn: (row, id, filterValues: string[]) => {
      if (!filterValues?.length) return true;
      const salary = row.getValue("salary") as string;
      const [minSalary, maxSalary] = salary.split("-").map(Number);
      return filterValues.some((range) => {
        const [min, max] = range.split("-").map(Number);
        if (range === "7000-plus") {
          return minSalary >= 7000 || maxSalary >= 7000;
        }
        return (
          (minSalary >= min && minSalary <= max) ||
          (maxSalary >= min && maxSalary <= max) ||
          (minSalary <= min && maxSalary >= max)
        );
      });
    },
  },
  // {
  //   accessorKey: "max_salary",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Max Salary" />
  //   ),
  //   cell: ({ row }) => {
  //     const min = parseFloat(row.getValue("max_salary"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(min);
  //     return <div>{formatted}</div>;
  //   },
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original;
      const { toast } = useToast();

      const copyToClipboard = async (text: string, data: string) => {
        await navigator.clipboard.writeText(text);
        toast({
          description: `Job ${data} copied to clipboard`,
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
            <ViewJobDialog job={job} />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => copyToClipboard(job.id, "ID")}>
              Copy job ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link
              href={{
                pathname: `/jobs/edit/${job.id}`,
              }}
            >
              <DropdownMenuItem>Edit Job</DropdownMenuItem>
            </Link>{" "}
            {/* <EditLocationDialog
              child={<DropdownMenuItem>Edit Location</DropdownMenuItem>}
              location={location}
            /> */}
            <AlertDialogDelete
              children={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete Job
                </DropdownMenuItem>
              }
              title="Delete Job"
              description="Are you sure you want to delete this Job?"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
