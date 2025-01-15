"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { CustomPagination } from "@/components/user/custom_pagination";
import Link from "next/link";
import { cn, delay } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableFacetedFilter } from "@/components/table/faceted_filter";
import { MapIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { FavoriteInterface, FavoriteType } from "@/types/favorite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, deleteFavorite } from "@/lib/api/favorite";
import LoadingFavorites from "./loading";
import { ErrorState } from "@/components/shared/error-state";
import EmptyState from "@/components/shared/empty-state";
import { CgSpinner } from "react-icons/cg";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";

const typeOptions = [
  { label: "Student Resources", value: "student_resource" },
  { label: "Jobs", value: "job" },
  { label: "Tourism", value: "tourism" },
  { label: "Business", value: "business" },
];

const columns: ColumnDef<FavoriteInterface>[] = [
  {
    id: "module",
    accessorKey: "module",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "name",
    accessorKey: "name",
    filterFn: "includesString",
  },
];

const FavoritesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sortConfig, setSortConfig] = useState<{
    key: "name";
    direction: "asc" | "desc";
  } | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(9);
  const [itemToRemove, setItemToRemove] = useState<FavoriteType | null>(null);
  const { userId } = useAuth();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If search field is cleared, reset the search
    if (value === "") {
      setSearchQuery("");
      table.getColumn("name")?.setFilterValue("");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    table.getColumn("name")?.setFilterValue(searchTerm);
  };

  if (!userId) {
    return (
      <ErrorState
        title="Unauthorized"
        description="You must be logged in to view this page."
      />
    );
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchList,
  } = useQuery({
    queryKey: [
      "favorites",
      pageIndex,
      pageSize,
      searchQuery,
      columnFilters.find((f) => f.id === "module")?.value,
    ],
    queryFn: () =>
      getFavorites({
        page: pageIndex,
        size: pageSize,
        name: searchQuery,
        types: columnFilters.find((f) => f.id === "module")?.value as string[],
        userId,
      }),
  });

  const queryClient = useQueryClient();
  const { mutate: removeFavorite, isPending: isDeleting } = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Success",
        description: "Item removed from favorites",
      });
      setItemToRemove(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  const table = useReactTable({
    data: data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      globalFilter: searchTerm,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
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

  const sortFavorites = (favorites: FavoriteType[]) => {
    if (!sortConfig) return favorites;

    return [...favorites].sort((a, b) => {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  };

  const sortedListFavorites = React.useMemo(() => {
    if (!data?.content) return [];
    return sortFavorites(data.content);
  }, [data?.content, sortConfig]);

  const getActiveSortLabel = () => {
    if (!sortConfig) return "Sort";

    const labels = {
      name: {
        asc: "Name (A-Z)",
        desc: "Name (Z-A)",
      },
    };

    return labels[sortConfig.key][sortConfig.direction];
  };

  if (isLoading) {
    return <LoadingFavorites />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load favorites"
        description="An error occurred while fetching the favorites. Please try again later."
        retryAction={() => refetchList()}
      />
    );
  }

  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          <div className="relative md:w-1/3 w-full">
            <Input
              placeholder="Search Favorites..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={handleSearch}
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-wrap items-center gap-2 flex">
            {table.getColumn("module") && (
              <DataTableFacetedFilter
                column={table.getColumn("module")}
                title="Modules"
                options={typeOptions}
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {getActiveSortLabel()}
                  {sortConfig &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUpIcon className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="ml-2 h-4 w-4" />
                    ))}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "name", direction: "asc" })
                  }
                  className={cn(
                    sortConfig?.key === "name" &&
                      sortConfig?.direction === "asc"
                      ? "bg-accent"
                      : ""
                  )}
                >
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  Name A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "name", direction: "desc" })
                  }
                  className={cn(
                    sortConfig?.key === "name" &&
                      sortConfig?.direction === "asc"
                      ? "bg-accent"
                      : ""
                  )}
                >
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  Name Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(columnFilters.length > 0 || sortConfig) && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  setSortConfig(null);
                  setSearchTerm("");
                }}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {data?.content.length === 0 ? null : (
        <div className="flex items-start justify-between flex-col md:flex-row w-full mb-4 gap-4">
          <CustomPagination table={table} />
        </div>
      )}

      {data?.content.length === 0 ? (
        <EmptyState
          title="No favorites found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedListFavorites.map((favorite) => (
            <Card key={favorite.id} className="flex flex-col h-[220px]">
              <CardHeader className="flex-none pb-2">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-medium line-clamp-1">
                      {favorite.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setItemToRemove(favorite)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {favorite.module.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {favorite.type.replace(/[-_]/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {favorite.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-1 pt-0">
                <div className="flex gap-2">
                  <MapIcon className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {favorite.address}
                  </span>
                </div>
                <Link
                  href={`/user/${
                    favorite.module === "student_resource"
                      ? "student-resources"
                      : favorite.module === "job"
                      ? "jobs"
                      : favorite.module
                  }/${favorite.itemId}`}
                  className="mt-3"
                >
                  <Button className="w-full" variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!itemToRemove}
        onOpenChange={(open) => !open && setItemToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToRemove?.name}" from your
              favorites? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={() => {
                if (itemToRemove) {
                  removeFavorite(itemToRemove.id);
                }
              }}
            >
              {isDeleting ? (
                <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FavoritesPage;
