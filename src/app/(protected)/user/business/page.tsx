"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapIcon,
  CircleDotIcon,
  ListIcon,
  PhoneIcon,
  SearchIcon,
  Mail,
  Globe,
  Building2,
  CalendarRange,
} from "lucide-react";
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
import { getBusinesses } from "@/lib/api/business";
import { BusinessType } from "@/types/business";
import BusinessLoading from "./loading";
import { ErrorState } from "@/components/shared/error-state";
import EmptyState from "@/components/shared/empty-state";

const types = [
  { label: "Business Center", value: "business_center" },
  { label: "Industry", value: "industry" },
  { label: "Event", value: "event" },
  { label: "Opportunity", value: "opportunity" },
];

const industries = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Retail", value: "retail" },
  { label: "Media", value: "media" },
  { label: "Construction", value: "construction" },
  { label: "Transportation", value: "transportation" },
  { label: "Energy", value: "energy" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Entertainment", value: "entertainment" },
];

const columns: ColumnDef<BusinessType>[] = [
  {
    id: "name",
    accessorKey: "name",
  },
  {
    id: "type",
    accessorKey: "type",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "category",
    accessorKey: "category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

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

const BusinessPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"list" | "map">("list");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sortConfig, setSortConfig] = useState<{
    key: "name";
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<BusinessType | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(9); // Changed: Remove setPageSize and set fixed value of 9

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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const {
    data,
    isLoading,
    isError,
    refetch: refetchList,
  } = useQuery({
    queryKey: [
      "businesses",
      pageIndex,
      9, // Changed: Use fixed value of 9 instead of pageSize variable
      searchQuery,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getBusinesses({
        page: pageIndex,
        size: 9, // Changed: Use fixed value of 9
        name: searchQuery,
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
      }),
  });

  // Add query for all locations for map view
  const { data: allBusinesses, refetch: refetchMap } = useQuery({
    queryKey: [
      "businesses-all",
      searchQuery,
      columnFilters.find((f) => f.id === "type")?.value,
    ],
    queryFn: () =>
      getBusinesses({
        page: 0,
        size: 1000,
        name: searchQuery,
        types: columnFilters.find((f) => f.id === "type")?.value as string[],
      }),
  });

  const table = useReactTable({
    data: data?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      globalFilter: searchTerm,
      pagination: {
        pageIndex,
        pageSize: 9, // Changed: Use fixed value of 9
      },
    },
    pageCount: data?.totalPages ?? 0,
    manualPagination: true,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex,
          pageSize: 9, // Changed: Use fixed value of 9
        });
        setPageIndex(newState.pageIndex);
        // Removed setPageSize since we're using a fixed value
      } else {
        setPageIndex(updater.pageIndex);
        // Removed setPageSize since we're using a fixed value
      }
    },
  });

  React.useEffect(() => {
    table.resetPagination();
  }, [searchTerm]);

  const sortBusinesses = (businesses: BusinessType[]) => {
    if (!sortConfig) return businesses;
    return [...businesses].sort((a, b) => {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  };

  const sortedListBusiness = React.useMemo(() => {
    if (!data?.content) return [];
    return sortBusinesses(data.content);
  }, [data?.content, sortConfig]);

  const filteredMapBusiness = React.useMemo(() => {
    if (!allBusinesses?.content) return [];
    return sortBusinesses(allBusinesses?.content);
  }, [allBusinesses?.content, sortConfig]);

  const handleMapClick = React.useCallback(() => {
    setSelectedMarker(null);
  }, []);

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

  if (isLoading) return <BusinessLoading />;
  if (isError)
    return (
      <ErrorState
        title="Failed to load businesses"
        description="An error occurred while fetching the businesses. Please try again later."
        retryAction={() =>
          activeView === "list" ? refetchList() : refetchMap()
        }
      />
    );

  return (
    <div className="container mx-auto py-4 space-y-4 px-0">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full">
          <div className="relative w-full md:w-1/3">
            <Input
              placeholder="Search businesses..."
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
                title="Types"
                options={types}
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
              title="No businesses found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedListBusiness.map((business) => (
                <Card key={business.id} className="flex flex-col h-[240px]">
                  <CardHeader className="flex-none pb-2">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-medium line-clamp-1">
                          {business.name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">
                          {business.type.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {business.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {business.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1 pt-0">
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <Building2 className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {business.location.address}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <CalendarRange className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {business.openingHours?.weekday || "Hours not specified"}
                        </span>
                      </div>
                    </div>
                    <Link href={`/user/business/${business.id}`} className="mt-3">
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

        <TabsContent value="map">
          {isLoaded && (
            <div className="relative w-full h-[600px]">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={SEOUL_CENTER}
                zoom={12}
                options={{
                  styles: mapStyles,
                  restriction: {
                    latLngBounds: SEOUL_BOUNDS,
                    strictBounds: true,
                  },
                }}
                onClick={handleMapClick}
              >
                {filteredMapBusiness.map((business) => (
                  <MarkerF
                    key={business.id}
                    position={{
                      lat: business.location.latitude,
                      lng: business.location.longitude,
                    }}
                    onClick={() => setSelectedMarker(business)}
                  />
                ))}
                {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: selectedMarker.location.latitude,
                      lng: selectedMarker.location.longitude,
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="text-lg font-medium">
                        {selectedMarker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedMarker.location.address}
                      </p>
                      <Link href={`/businesses/${selectedMarker.id}`}>
                        <Button variant="link" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessPage;
