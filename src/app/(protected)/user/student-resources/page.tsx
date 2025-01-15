"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon, MapIcon, ListIcon, SearchIcon, SearchX } from "lucide-react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { DataTableFacetedFilter } from "@/components/table/faceted_filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ArrowDownIcon, ArrowUpIcon, SlidersHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getStudentResources } from "@/lib/api/student-resources";
import { StudentResource } from "@/types/student-resource";
import ViewResourcesLoading from "./loading";
import { ErrorState } from "@/components/shared/error-state";
import EmptyState from "@/components/shared/empty-state";

// Map configurations
const SEOUL_BOUNDS = {
  north: 37.701,
  south: 37.4283,
  west: 126.7643,
  east: 127.1831,
};

const SEOUL_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const categories = [
  { label: "University", value: "university" },
  { label: "Library", value: "library" },
  { label: "Secondary School", value: "secondary_school" },
  { label: "Primary School", value: "primary_school" },
  { label: "Book Store", value: "book_store" },
];

const columns: ColumnDef<StudentResource>[] = [
  {
    id: "type",
    accessorKey: "type",
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

const StudentResourcesPage = () => {
  // ... existing useState declarations ...
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"list" | "map">("list");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "rating";
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<StudentResource | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(9);

  // Add search handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setSearchQuery("");
      table.getColumn("name")?.setFilterValue("");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    table.getColumn("name")?.setFilterValue(searchTerm);
  };

  // Fetch data using React Query
  const {
    data,
    isLoading,
    isError,
    refetch: refetchList,
  } = useQuery({
    queryKey: [
      "student-resources",
      pageIndex,
      pageSize,
      searchQuery,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getStudentResources({
        page: pageIndex,
        size: pageSize,
        name: searchQuery,
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
      }),
  });

  // Add query for all locations
  const { data: allLocations, refetch: refetchMap } = useQuery({
    queryKey: [
      "student-resources-all",
      searchQuery,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getStudentResources({
        page: 0,
        size: 1000,
        name: searchQuery,
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
      }),
  });

  // ... existing useLoadScript call ...
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Table configuration
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

  // Sorting function
  const sortLocations = (locations: StudentResource[]) => {
    if (!sortConfig) return locations;
    return [...locations].sort((a, b) => {
      if (sortConfig.key === "name") {
        return sortConfig.direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortConfig.direction === "asc"
        ? (a.rating || 0) - (b.rating || 0)
        : (b.rating || 0) - (a.rating || 0);
    });
  };

  // Filtered and sorted locations
  const filteredMapLocations = React.useMemo(() => {
    if (!allLocations?.content) return [];
    return sortLocations(allLocations.content);
  }, [allLocations?.content, sortConfig]);

  const sortedListLocations = React.useMemo(() => {
    if (!data?.content) return [];
    return sortLocations(data.content);
  }, [data?.content, sortConfig]);

  const handleMapClick = React.useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Get active sort label
  const getActiveSortLabel = () => {
    if (!sortConfig) return "Sort";
    const labels = {
      name: {
        asc: "Name (A-Z)",
        desc: "Name (Z-A)",
      },
      rating: {
        asc: "Rating (Lowest)",
        desc: "Rating (Highest)",
      },
    };
    return labels[sortConfig.key][sortConfig.direction];
  };

  if (isLoading) return <ViewResourcesLoading />;
  if (isError)
    return (
      <ErrorState
        title="Failed to load Student Resources"
        description="An error occurred while fetching the Student Resources. Please try again later."
        retryAction={() =>
          activeView === "list" ? refetchList() : refetchMap()
        }
      />
    );

  // ... existing return statement with updated rendering logic ...
  // Return statement starts here
  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          <div className="relative md:w-1/3 w-full">
            <Input
              placeholder="Search locations..."
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
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="Categories"
                options={categories}
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
                      sortConfig?.direction === "desc"
                      ? "bg-accent"
                      : ""
                  )}
                >
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  Name Z-A
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "rating", direction: "desc" })
                  }
                  className={cn(
                    sortConfig?.key === "rating" &&
                      sortConfig?.direction === "desc"
                      ? "bg-accent"
                      : ""
                  )}
                >
                  <StarIcon className="mr-2 h-4 w-4" />
                  Rating (Highest)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "rating", direction: "asc" })
                  }
                  className={cn(
                    sortConfig?.key === "rating" &&
                      sortConfig?.direction === "asc"
                      ? "bg-accent"
                      : ""
                  )}
                >
                  <StarIcon className="mr-2 h-4 w-4" />
                  Rating (Lowest)
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

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as "list" | "map")}
        className="w-full"
      >
        <div className="flex items-start justify-between flex-col md:flex-row w-full mb-4 gap-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="list">
              <ListIcon className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map">
              <MapIcon className="h-4 w-4 mr-2" />
              Map View
            </TabsTrigger>
          </TabsList>
          {activeView === "list" && <CustomPagination table={table} />}
        </div>

        <TabsContent value="list">
          {data?.content.length === 0 ? (
            <EmptyState
              title="No student resources found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedListLocations.map((resource) => (
                <Card key={resource.id} className="flex flex-col h-[200px]">
                  <CardHeader className="flex-none pb-2">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-medium line-clamp-1">
                          {resource.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="capitalize shrink-0"
                        >
                          {resource.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {resource.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1 pt-0">
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <MapIcon className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {resource.location.address}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/user/student-resources/${resource.id}`}
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
        </TabsContent>

        <TabsContent value="map" className="h-[calc(100vh-250px)]">
          {isLoaded ? (
            <GoogleMap
              mapContainerClassName="w-full h-full rounded-lg"
              center={SEOUL_CENTER}
              zoom={14}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                zoomControl: true,
                styles: mapStyles,
                disableDefaultUI: false,
                clickableIcons: false,
                restriction: {
                  latLngBounds: SEOUL_BOUNDS,
                  strictBounds: true,
                },
                minZoom: 11,
                maxZoom: 18,
              }}
              onClick={handleMapClick}
            >
              {filteredMapLocations.length === 0 ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-10">
                  <EmptyState
                    title="No locations found on map"
                    description="Try adjusting your search or filters to find locations in this area."
                  />
                </div>
              ) : (
                <>
                  {filteredMapLocations.map((resource) => (
                    <MarkerF
                      key={resource.id}
                      position={{
                        lat: resource.location.latitude,
                        lng: resource.location.longitude,
                      }}
                      title={resource.name}
                      onClick={() => setSelectedMarker(resource)}
                    />
                  ))}
                  {selectedMarker && (
                    <InfoWindow
                      position={{
                        lat: selectedMarker.location.latitude,
                        lng: selectedMarker.location.longitude,
                      }}
                      onCloseClick={() => setSelectedMarker(null)}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, -30),
                        maxWidth: 220,
                      }}
                    >
                      <div className="overflow-hidden">
                        <h3 className="text-lg font-semibold">
                          {selectedMarker.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {selectedMarker.type.replace("_", " ")}
                        </p>
                        <Link
                          href={`/user/student-resources/${selectedMarker.id}`}
                        >
                          <Button variant="outline" className="mt-2 w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Loading map...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentResourcesPage;
