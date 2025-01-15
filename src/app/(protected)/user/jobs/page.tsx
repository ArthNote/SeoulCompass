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
import { PiMoney } from "react-icons/pi";
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
import { getJobs } from "@/lib/api/jobs";
import { JobType } from "@/types/job";
import JobsLoading from "./loading";
import { ErrorState } from "@/components/shared/error-state";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import EmptyState from "@/components/shared/empty-state";

// Mock data for jobs
const data: Job[] = [
  {
    id: "1",
    title: "Software Engineer",
    company: "Tech Innovators",
    industry: "technology",
    description: "Develop and maintain scalable web applications.",
    salary: "4500-6000",
    contact: "hr@techinnovators.com",
    location: "Seoul, Gangnam-gu",
  },
  {
    id: "2",
    title: "Financial Analyst",
    company: "Future Finance Co.",
    industry: "finance",
    description: "Analyze market trends and provide investment strategies.",
    salary: "4000-5500",
    contact: "careers@futurefinance.com",
    location: "Seoul, South Korea",
  },
  {
    id: "3",
    title: "Nurse",
    company: "HealthFirst Hospital",
    industry: "healthcare",
    description: "Provide patient care and assist in medical procedures.",
    salary: "3000-4500",
    contact: "apply@healthfirst.com",
    location: "Seoul, South Korea",
  },
  {
    id: "4",
    title: "University Lecturer",
    company: "Global University",
    industry: "education",
    description: "Teach undergraduate courses in computer science.",
    salary: "3500-5000",
    contact: "faculty@globaluniversity.com",
    location: "Seoul, South Korea",
  },
  {
    id: "5",
    title: "Store Manager",
    company: "Urban Trends Retail",
    industry: "retail",
    description: "Oversee store operations and manage staff.",
    salary: "3000-4000",
    contact: "jobs@urbantrends.com",
    location: "Seoul, South Korea",
  },
  {
    id: "6",
    title: "Mechanical Engineer",
    company: "Prime Manufacturing Co.",
    industry: "manufacturing",
    description: "Design and develop mechanical systems for production.",
    salary: "4500-6000",
    contact: "recruit@primemanufacturing.com",
    location: "Seoul, South Korea",
  },
  {
    id: "7",
    title: "Hotel Manager",
    company: "Luxury Stay Hotels",
    industry: "hospitality",
    description: "Manage hotel operations and ensure guest satisfaction.",
    salary: "5000-6500",
    contact: "apply@luxurystay.com",
    location: "Seoul, South Korea",
  },
  {
    id: "8",
    title: "Civil Engineer",
    company: "BuildSmart Constructions",
    industry: "construction",
    description: "Plan and execute construction projects.",
    salary: "4000-5500",
    contact: "careers@buildsmart.com",
    location: "Seoul, South Korea",
  },
  {
    id: "9",
    title: "Graphic Designer",
    company: "Vision Media Group",
    industry: "media",
    description: "Create visual concepts for advertising and branding.",
    salary: "3500-4500",
    contact: "design@visionmedia.com",
    location: "Seoul, South Korea",
  },
  {
    id: "10",
    title: "Logistics Manager",
    company: "Swift Transport Solutions",
    industry: "transportation",
    description: "Coordinate and manage supply chain operations.",
    salary: "4500-6000",
    contact: "hr@swifttransport.com",
    location: "Seoul, South Korea",
  },
  {
    id: "11",
    title: "Data Scientist",
    company: "AI Innovators",
    industry: "technology",
    description: "Analyze large datasets to derive actionable insights.",
    salary: "5000-7000",
    contact: "jobs@aiinnovators.com",
    location: "Seoul, South Korea",
  },
  {
    id: "12",
    title: "Investment Banker",
    company: "Core Capital",
    industry: "finance",
    description: "Manage financial portfolios and investment opportunities.",
    salary: "7000-10000",
    contact: "apply@corecapital.com",
    location: "Seoul, South Korea",
  },
  {
    id: "13",
    title: "Pharmacist",
    company: "CityHealth Pharmacy",
    industry: "healthcare",
    description: "Dispense medications and advise patients on prescriptions.",
    salary: "4000-5000",
    contact: "careers@cityhealth.com",
    location: "Seoul, South Korea",
  },
  {
    id: "14",
    title: "High School Teacher",
    company: "Future Academy",
    industry: "education",
    description: "Teach mathematics to high school students.",
    salary: "3500-4500",
    contact: "teachers@futureacademy.com",
    location: "Seoul, South Korea",
  },
  {
    id: "15",
    title: "Retail Associate",
    company: "CityStyle Boutique",
    industry: "retail",
    description: "Assist customers and manage inventory in the store.",
    salary: "2500-3500",
    contact: "hr@citystyle.com",
    location: "Seoul, South Korea",
  },
  {
    id: "16",
    title: "Production Supervisor",
    company: "Mega Factory Ltd.",
    industry: "manufacturing",
    description: "Oversee production processes and ensure efficiency.",
    salary: "4000-5000",
    contact: "jobs@megafactory.com",
    location: "Seoul, South Korea",
  },
  {
    id: "17",
    title: "Event Coordinator",
    company: "Prestige Events",
    industry: "hospitality",
    description: "Plan and execute events for corporate clients.",
    salary: "3500-4500",
    contact: "careers@prestigeevents.com",
    location: "Seoul, South Korea",
  },
  {
    id: "18",
    title: "Architect",
    company: "Modern Designs Ltd.",
    industry: "construction",
    description: "Design innovative and sustainable buildings.",
    salary: "5000-7000",
    contact: "apply@moderndesigns.com",
    location: "Seoul, South Korea",
  },
  {
    id: "19",
    title: "Content Writer",
    company: "Creative Media Group",
    industry: "media",
    description: "Write engaging content for digital platforms.",
    salary: "3000-4000",
    contact: "jobs@creativemedia.com",
    location: "Seoul, South Korea",
  },
  {
    id: "20",
    title: "Fleet Manager",
    company: "Speed Logistics",
    industry: "transportation",
    description: "Manage fleet operations and vehicle maintenance.",
    salary: "4500-5500",
    contact: "careers@speedlogistics.com",
    location: "Seoul, South Korea",
  },
];

const industries = [
  { label: "Technology", value: "technology" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Construction", value: "construction" },
  { label: "Media", value: "media" },
  { label: "Transportation", value: "transportation" },
];

const columns: ColumnDef<JobType>[] = [
  {
    id: "industry",
    accessorKey: "industry",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "salary",
    accessorKey: "salary",
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
  {
    id: "title",
    accessorKey: "title",
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

type Job = {
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

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"list" | "map">("list");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sortConfig, setSortConfig] = useState<{
    key: "title";
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<JobType | null>(null);
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [tempSalaryRange, setTempSalaryRange] = useState({ min: "", max: "" });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(9); // Make it a constant 9

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setSearchQuery("");
      table.getColumn("title")?.setFilterValue("");
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    table.getColumn("title")?.setFilterValue(searchTerm);
  };

  const handleSalaryInputChange = (field: "min" | "max", value: string) => {
    const sanitizedValue = value.replace(/[^\d]/g, "");
    setTempSalaryRange((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  const applySalaryFilter = () => {
    const min = parseInt(tempSalaryRange.min) || 0;
    const max = parseInt(tempSalaryRange.max) || Infinity;
    setSalaryRange(tempSalaryRange);
    table.getColumn("salary")?.setFilterValue(`${min}-${max}`);
    setIsPopoverOpen(false);
  };

  const {
    data,
    isLoading,
    isError,
    refetch: refetchList,
  } = useQuery({
    queryKey: [
      "jobs",
      pageIndex,
      9, // Using the constant pageSize of 9
      searchQuery,
      columnFilters.find((f) => f.id === "industry")?.value,
      salaryRange,
    ],
    queryFn: () =>
      getJobs({
        page: pageIndex,
        size: 9, // Using the constant pageSize of 9
        title: searchQuery,
        industries: columnFilters.find((f) => f.id === "industry")
          ?.value as string[],
        minSalary: parseInt(salaryRange.min) || undefined,
        maxSalary: parseInt(salaryRange.max) || undefined,
      }),
  });

  // Add query for all locations
  const { data: allJobs, refetch: refetchMap } = useQuery({
    queryKey: [
      "jobs-all",
      searchQuery,
      columnFilters.find((f) => f.id === "industry")?.value,
    ],
    queryFn: () =>
      getJobs({
        page: 0,
        size: 1000,
        title: searchQuery,
        types: columnFilters.find((f) => f.id === "industry")
          ?.value as string[],
      }),
  });

  // Same table configuration and filtering logic as student resources
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
        pageSize, // Explicitly set to 9
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

  React.useEffect(() => {
    table.resetPagination();
  }, [searchTerm]);

  const sortJobs = (jobs: JobType[]) => {
    if (!sortConfig) return jobs;
    return [...jobs].sort((a, b) => {
      return sortConfig.direction === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  };

  const sortedListLocations = React.useMemo(() => {
    if (!data?.content) return [];
    return sortJobs(data.content);
  }, [data?.content, sortConfig]);

  const filteredMapLocations = React.useMemo(() => {
    if (!allJobs?.content) return [];
    return sortJobs(allJobs?.content);
  }, [data?.content, sortConfig]);

  const handleMapClick = React.useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const getActiveSortLabel = () => {
    if (!sortConfig) return "Sort";
    const labels = {
      title: {
        asc: "Title (A-Z)",
        desc: "Title (Z-A)",
      },
    };
    return labels[sortConfig.key][sortConfig.direction];
  };

  if (isLoading) return <JobsLoading />;
  if (isError)
    return (
      <ErrorState
        title="Failed to load Jobs"
        description="An error occurred while fetching the Jobs. Please try again later."
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
              placeholder="Search jobs..."
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
            {table.getColumn("industry") && (
              <DataTableFacetedFilter
                column={table.getColumn("industry")}
                title="Industries" // Changed from "Categories" to "Industries"
                options={industries}
              />
            )}

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-dashed"
                >
                  <PlusCircledIcon className="mr-2 h-4 w-4" />
                  {salaryRange.min || salaryRange.max
                    ? `$${salaryRange.min || "0"} - $${salaryRange.max || "∞"}`
                    : "Salary Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Salary Range</h4>
                    <p className="text-sm text-muted-foreground">
                      Set the minimum and maximum salary
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-1">
                        <Label htmlFor="minSalary">Min</Label>
                        <Input
                          id="minSalary"
                          placeholder="Min salary"
                          value={tempSalaryRange.min}
                          onChange={(e) =>
                            handleSalaryInputChange("min", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label htmlFor="maxSalary">Max</Label>
                        <Input
                          id="maxSalary"
                          placeholder="Max salary"
                          value={tempSalaryRange.max}
                          onChange={(e) =>
                            handleSalaryInputChange("max", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={applySalaryFilter}
                        disabled={!tempSalaryRange.min && !tempSalaryRange.max}
                        className="flex-1"
                      >
                        Apply Filter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempSalaryRange({ min: "", max: "" });
                          setSalaryRange({ min: "", max: "" });
                          table.getColumn("salary")?.setFilterValue(undefined);
                          setIsPopoverOpen(false);
                        }}
                        className="flex-none"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {getActiveSortLabel()}
                  {sortConfig && (
                    <>
                      Title {sortConfig.direction === "asc" ? "(A-Z)" : "(Z-A)"}
                      {sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="ml-2 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "title", direction: "asc" })
                  }
                  className={cn(
                    sortConfig?.direction === "asc" ? "bg-accent" : ""
                  )}
                >
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  Title A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortConfig({ key: "title", direction: "desc" })
                  }
                  className={cn(
                    sortConfig?.direction === "desc" ? "bg-accent" : ""
                  )}
                >
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  Title Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(columnFilters.length > 0 ||
              sortConfig ||
              searchQuery ||
              salaryRange.min ||
              salaryRange.max) && (
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetColumnFilters();
                  setSortConfig(null);
                  setSearchTerm("");
                  setSearchQuery("");
                  setSalaryRange({ min: "", max: "" });
                  setTempSalaryRange({ min: "", max: "" });
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
        {" "}
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
              title="No jobs found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedListLocations.map((job) => (
                <Card key={job.id} className="flex flex-col h-[220px]">
                  <CardHeader className="flex-none pb-2">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-medium line-clamp-1">
                          {job.title}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="capitalize shrink-0"
                        >
                          {job.industry.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                        {job.company.name}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-1 pt-0">
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <MapIcon className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {job.location.address}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <PiMoney className="h-4 w-4 flex-shrink-0 mt-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          ${job.salary.min.toLocaleString()} - $
                          {job.salary.max.toLocaleString()} ({job.salary.period}
                          )
                        </span>
                      </div>
                    </div>
                    <Link href={`/user/jobs/${job.id}`} className="mt-3">
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
              {filteredMapLocations.map((job) => (
                <MarkerF
                  key={job.id}
                  position={{ lat: job.location.lat, lng: job.location.lng }}
                  title={job.title}
                  onClick={() => setSelectedMarker(job)}
                />
              ))}

              {selectedMarker && (
                <InfoWindow
                  position={{
                    lat: selectedMarker.location.lat,
                    lng: selectedMarker.location.lng,
                  }}
                  onCloseClick={() => setSelectedMarker(null)}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -30),
                    maxWidth: 220,
                  }}
                >
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-semibold">
                      {selectedMarker.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {selectedMarker.company.name}
                    </p>
                    <p className="text-sm">Contact: {selectedMarker.contact}</p>
                    <p className="text-sm">
                      Salary: $
                      {selectedMarker.salary.max +
                        "$ - " +
                        selectedMarker.salary.min +
                        "$"}
                    </p>
                    <Link href={`/user/jobs/${selectedMarker.id}`}>
                      <Button variant="outline" className="mt-2 w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </InfoWindow>
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

export default JobsPage;
