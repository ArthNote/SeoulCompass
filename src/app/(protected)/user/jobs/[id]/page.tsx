"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Share2,
  BookmarkPlus,
  ArrowLeftIcon,
  MapIcon,
  PhoneIcon,
  Clock,
  Building2,
  Mail,
  Users,
  CalendarRange,
  Facebook,
  Twitter,
  Link2,
  Navigation2,
  Heart,
  Globe,
  Briefcase,
  PiggyBank,
  GraduationCap,
  X,
  CircleDotIcon,
} from "lucide-react";
import { PiMoney } from "react-icons/pi";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { getJobById } from "@/lib/api/jobs";
import { JobType } from "@/types/job";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorState } from "@/components/shared/error-state";
import ViewJobLoading from "./loading";
import {
  createFavorite,
  deleteFavoriteByItemId,
  favoriteExists,
} from "@/lib/api/favorite";
import { CgSpinner } from "react-icons/cg";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

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

const SEOUL_BOUNDS = {
  north: 37.701,
  south: 37.4283,
  west: 126.7643,
  east: 127.1831,
};

const JobDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id as string),
    enabled: !!id,
  });

  const [isFavorited, setIsFavorited] = useState(false);

  // Add this query to check if job is favorited
  const { data: isJobFavorited } = useQuery({
    queryKey: ["job-favorited", job?.id],
    queryFn: () => favoriteExists(job?.id as string, userId as string),
    enabled: !!job?.id,
  });

  useEffect(() => {
    if (isJobFavorited !== undefined) {
      setIsFavorited(isJobFavorited);
    }
  }, [isJobFavorited]);

  // Add mutation for removing from favorites
  const { mutate: removeFromFavorite, isPending: isRemoving } = useMutation({
    mutationFn: () => deleteFavoriteByItemId(job?.id as string, userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["job-favorited", job?.id] });
      setIsFavorited(false);
      toast({
        title: "Success",
        description: "Job removed from favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove job from favorites",
        variant: "destructive",
      });
    },
  });

  // Update the mutation success handler for adding to favorites
  const { mutate: addToFavorite, isPending: isAdding } = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["job-favorited", job?.id] });
      setIsFavorited(true);
      toast({
        title: "Success",
        description: "Job added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add job to favorites",
        variant: "destructive",
      });
    },
  });

  const handleShare = async (method: "clipboard" | "facebook" | "twitter") => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    switch (method) {
      case "clipboard":
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied to clipboard",
        });
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
        break;
    }
  };

  const handleGetDirections = () => {
    if (!job) return;
    const destination = `${job.location.lat},${job.location.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`,
      "_blank"
    );
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Add map zoom level state
  const [mapZoom, setMapZoom] = useState(15);

  if (isLoading) return <ViewJobLoading />;
  if (isError || !job) {
    return (
      <ErrorState
        title="Failed to load job details"
        description="An error occurred while fetching the job details. Please try again later."
        retryAction={() => refetch()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div>
        <div className="container flex items-center justify-between h-16 px-0">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <div className="w-full flex gap-1">Back</div>
          </Button>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Share this job</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-6">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-8 w-8" />
                    <span className="text-sm">Facebook</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="h-8 w-8" />
                    <span className="text-sm">Twitter</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("clipboard")}
                  >
                    <Link2 className="h-8 w-8" />
                    <span className="text-sm">Copy Link</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant={isFavorited ? "default" : "outline"}
              size="sm"
              disabled={isAdding || isRemoving}
              onClick={() => {
                if (isFavorited) {
                  removeFromFavorite();
                } else {
                  addToFavorite({
                    id: "",
                    itemId: job.id,
                    name: job.title,
                    userId: userId as string,
                    description: job.description,
                    module: "job",
                    type: job.industry,
                    address: job.location.address,
                    createdAt: new Date().toISOString(),
                  });
                }
              }}
            >
              {isAdding || isRemoving ? (
                <CgSpinner className="animate-spin mr-2" />
              ) : (
                <Heart
                  className={cn("h-4 w-4", isFavorited && "fill-current")}
                />
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={handleGetDirections}>
              <Navigation2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Separator />
      </div>

      <div className="container py-6 px-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{job.title}</h1>
                      <Badge variant="outline" className="capitalize">
                        {job.industry.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapIcon className="h-4 w-4 text-primary" />
                      <span>{job.location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PiMoney className="h-4 w-4 text-primary" />
                      <span>
                        ${job.salary.min.toLocaleString()} - $
                        {job.salary.max.toLocaleString()} ({job.salary.period})
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Job Description</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="font-medium">Education</span>
                          </div>
                          {job.requirements.education === "none" ? (
                            <span className="text-sm text-muted-foreground">
                              No specific education required
                            </span>
                          ) : (
                            <Badge variant="secondary" className="capitalize">
                              {job.requirements.education.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                        <Separator />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span className="font-medium">Experience</span>
                          </div>
                          {job.requirements.experience === 0 ? (
                            <span className="text-sm text-muted-foreground">
                              No experience required
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {job.requirements.experience}{" "}
                              {job.requirements.experience === 1
                                ? "year"
                                : "years"}{" "}
                              required
                            </span>
                          )}
                        </div>
                        <Separator />
                      </div>

                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-2">
                          <CircleDotIcon className="h-4 w-4 text-primary" />
                          <span className="font-medium">Required Skills</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {job.requirements.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiggyBank className="h-5 w-5" />
                      Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="text-muted-foreground">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarRange className="h-5 w-5" />
                      Work Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Working Days</p>
                        <p className="text-muted-foreground capitalize">
                          {job.workSchedule.workdays.from} to{" "}
                          {job.workSchedule.workdays.to}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Working Hours</p>
                        <p className="text-muted-foreground">
                          {job.workSchedule.workhours.from} to{" "}
                          {job.workSchedule.workhours.to}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {job.type.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {job.workLocation}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapIcon className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">
                          Office Location
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">
                          {job.location.address}
                        </p>
                      </div>
                      <div className="h-[400px] rounded-lg overflow-hidden border">
                        {isLoaded ? (
                          <GoogleMap
                            mapContainerClassName="w-full h-full"
                            center={{
                              lat: job.location.lat,
                              lng: job.location.lng,
                            }}
                            zoom={mapZoom}
                            onZoomChanged={() => {
                              const map = document.querySelector(
                                'div[aria-label="Map"]'
                              );
                              if (map) {
                                const zoom = (map as any).__gm?.getZoom();
                                if (zoom) setMapZoom(zoom);
                              }
                            }}
                            options={{
                              streetViewControl: false,
                              mapTypeControl: false,
                              fullscreenControl: true,
                              zoomControl: true,
                              styles: mapStyles,
                              restriction: {
                                latLngBounds: SEOUL_BOUNDS,
                                strictBounds: true,
                              },
                              minZoom: 11,
                              maxZoom: 18,
                              mapTypeId: "roadmap",
                              clickableIcons: false,
                            }}
                          >
                            <MarkerF
                              position={{
                                lat: job.location.lat,
                                lng: job.location.lng,
                              }}
                              title={job.company.name}
                              animation={google.maps.Animation.DROP}
                            />
                          </GoogleMap>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <div className="animate-pulse text-muted-foreground">
                              Loading map...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {job.company.name}
                    </h3>
                    <p className="text-muted-foreground capitalize">
                      {job.company.industry} Company
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {job.company.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {job.company.employees.toLocaleString()}+ Employees
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{job.contact}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      Apply before {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
