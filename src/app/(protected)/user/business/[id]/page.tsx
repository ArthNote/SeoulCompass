"use client";

import React, { useState, useEffect, use } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  MapIcon,
  PhoneIcon,
  ArrowLeftIcon,
  Share2,
  Heart,
  Camera,
  MessageCircle,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Globe,
  Navigation2,
  Building2,
  Clock,
  Link2,
  CalendarRange,
  GraduationCap,
  Users,
  ArrowRight,
  PiggyBank,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBusinessById } from "@/lib/api/business";
import { BusinessType } from "@/types/business";
import { ErrorState } from "@/components/shared/error-state";
import { cn, delay } from "@/lib/utils";
import {
  createFavorite,
  deleteFavoriteByItemId,
  favoriteExists,
} from "@/lib/api/favorite";
import { CgSpinner } from "react-icons/cg";
import BusinessDetailLoading from "./loading";
import { currentUser, User } from "@clerk/nextjs/server";
import { set } from "date-fns";
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

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const convertTo24Hour = (timeStr: string) => {
  if (!timeStr) return { hours: 0, minutes: 0 };
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) {
    hours = hours + 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes: minutes || 0 };
};

const isCurrentlyOpen = (business: BusinessType) => {
  if (!business?.openingHours) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  const schedule = isWeekend(now)
    ? business.openingHours.weekend
    : business.openingHours.weekday;

  if (!schedule) return false;

  try {
    const [openTimeStr, closeTimeStr] = schedule
      .split("-")
      .map((t) => t.trim());
    if (!openTimeStr || !closeTimeStr) return false;

    const openTime = convertTo24Hour(openTimeStr);
    const closeTime = convertTo24Hour(closeTimeStr);

    const openTimeInMinutes = openTime.hours * 60 + openTime.minutes;
    const closeTimeInMinutes = closeTime.hours * 60 + closeTime.minutes;

    return (
      currentTimeInMinutes >= openTimeInMinutes &&
      currentTimeInMinutes < closeTimeInMinutes
    );
  } catch (error) {
    console.error("Error parsing opening hours:", error);
    return false;
  }
};

const getNextOpenTime = (business: BusinessType) => {
  if (!business?.openingHours) return "N/A";

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedule = isWeekend(tomorrow)
    ? business.openingHours.weekend
    : business.openingHours.weekday;

  if (!schedule) return "N/A";

  try {
    const [openTimeStr] = schedule.split("-").map((t) => t.trim());
    return openTimeStr || "N/A";
  } catch (error) {
    console.error("Error getting next open time:", error);
    return "N/A";
  }
};

const shareUrl = typeof window !== "undefined" ? window.location.href : "";

export default function BusinessDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const { userId } = useAuth();

  useEffect(() => {
    if (!id) {
      redirect("/user/business");
    }
  }, [id]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const {
    data: business,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["businesses", id],
    queryFn: () => getBusinessById(id),
    enabled: !!id,
  });

  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Check if business is favorited
  const { data: isBusinessFavorited } = useQuery({
    queryKey: ["business-favorited", business?.id],
    queryFn: () => favoriteExists(business?.id as string, userId as string),
    enabled: !!business?.id,
  });

  // Favorite mutations
  const { mutate: addToFavorite, isPending } = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["business-favorited", business?.id],
      });
      toast({
        title: "Success",
        description: "Business added to favorites",
      });
    },
  });

  const { mutate: removeFromFavorite, isPending: isRemoving } = useMutation({
    mutationFn:() => deleteFavoriteByItemId(business?.id as string, userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["business-favorited", business?.id],
      });
      setIsFavorited(false);
      toast({
        title: "Success",
        description: "Business removed from favorites",
      });
    },
  });

  // Update favorited state when data changes
  useEffect(() => {
    if (isBusinessFavorited !== undefined) {
      setIsFavorited(isBusinessFavorited);
    }
  }, [isBusinessFavorited]);

  // Image gallery controls
  const nextImage = () => {
    if (business?.photos) {
      setCurrentImageIndex((prev) => (prev + 1) % business.photos!.length);
    }
  };

  const prevImage = () => {
    if (business?.photos) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + business.photos!.length) % business.photos!.length
      );
    }
  };

  // Auto-advance images
  useEffect(() => {
    if (business?.photos && business.photos.length > 1) {
      const timer = setInterval(nextImage, 5000);
      return () => clearInterval(timer);
    }
  }, [business?.photos]);

  // Share functionality
  const handleShare = async (method: "clipboard" | "facebook" | "twitter") => {
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
    if (business) {
      const destination = `${business.location.latitude},${business.location.longitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`;
      window.open(url, "_blank");
    }
  };

  if (isLoading) return <BusinessDetailLoading />;
  if (isError || !business)
    return (
      <ErrorState
        title="Error loading business"
        description="Failed to load business details"
        retryAction={() => refetch()}
      />
    );

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
                  <DialogTitle className="text-xl">
                    Share this resource
                  </DialogTitle>
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
              disabled={isPending || isRemoving}
              onClick={() => {
                if (isFavorited) {
                  removeFromFavorite();
                } else {
                  addToFavorite({
                    id: "",
                    itemId: business.id,
                    userId: userId as string,
                    name: business.name,
                    description: business.description,
                    module: "business",
                    type: business.type,
                    address: business.location.address,
                    createdAt: new Date().toISOString(),
                  });
                }
              }}
            >
              {isPending || isRemoving ? (
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
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    <Badge
                      variant={
                        isCurrentlyOpen(business) ? "default" : "secondary"
                      }
                      className={cn(
                        isCurrentlyOpen(business)
                          ? "bg-green-500/15 text-green-500"
                          : "bg-red-500/15 text-red-500"
                      )}
                    >
                      {isCurrentlyOpen(business) ? "Open Now" : "Closed"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="outline" className="capitalize">
                      {business.type.replace(/_/g, " ")}
                    </Badge>
                    <span>•</span>
                    <span className="text-muted-foreground">
                      {business.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {business.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="photos" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              {/* Photos Tab */}
              <TabsContent value="photos">
                <Card>
                  <CardContent className="p-6">
                    {business.photos && business.photos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {business.photos.map((photo, index) => (
                          <div
                            key={index}
                            className={cn(
                              "relative aspect-square rounded-lg overflow-hidden cursor-pointer group",
                              index === 0 && "sm:col-span-2 sm:row-span-2"
                            )}
                            onClick={() => setSelectedImage(photo)}
                          >
                            <Image
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Photos Available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This business hasn't uploaded any photos yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!business.opportunities?.mentorshipPrograms?.length &&
                    !business.opportunities?.networkingEvents?.length &&
                    !business.opportunities?.funding?.length ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <CalendarRange className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Opportunities Available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Check back later for upcoming opportunities and
                          events.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {/* Mentorship Programs Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-primary" />
                            Mentorship Programs
                          </h3>
                          {business.opportunities?.mentorshipPrograms
                            ?.length ? (
                            <div className="grid gap-4">
                              {business.opportunities.mentorshipPrograms.map(
                                (program, index) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                          <h4 className="font-semibold">
                                            {program.name}
                                          </h4>
                                          <Badge variant="outline">
                                            {program.mentorType}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {program.description}
                                        </p>
                                        {program.duration && (
                                          <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{program.duration}</span>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="rounded-lg border bg-card text-card-foreground p-6">
                              <div className="flex flex-col items-center text-center">
                                <GraduationCap className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  No mentorship programs are currently
                                  available.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Networking Events Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Upcoming Events
                          </h3>
                          {business.opportunities?.networkingEvents?.length ? (
                            <div className="grid gap-4">
                              {business.opportunities.networkingEvents.map(
                                (event, index) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="space-y-3">
                                        <h4 className="font-semibold">
                                          {event.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {event.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                          <div className="flex items-center gap-2">
                                            <CalendarRange className="h-4 w-4 text-primary" />
                                            <span>
                                              {new Date(
                                                event.date
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <MapIcon className="h-4 w-4 text-primary" />
                                            <span>{event.location}</span>
                                          </div>
                                        </div>
                                        {event.registrationLink && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto"
                                            asChild
                                          >
                                            <Link
                                              href={event.registrationLink}
                                              target="_blank"
                                            >
                                              Register Now
                                              <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                          </Button>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="rounded-lg border bg-card text-card-foreground p-6">
                              <div className="flex flex-col items-center text-center">
                                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  No networking events are scheduled at this
                                  time.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Funding Opportunities Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-primary" />
                            Funding Opportunities
                          </h3>
                          {business.opportunities?.funding?.length ? (
                            <div className="grid gap-4">
                              {business.opportunities.funding.map(
                                (fund, index) => (
                                  <Card key={index}>
                                    <CardContent className="p-4">
                                      <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h4 className="font-semibold">
                                              {fund.name}
                                            </h4>
                                            <p className="text-2xl font-bold text-primary">
                                              $
                                              {parseInt(
                                                fund.amount
                                              ).toLocaleString()}
                                            </p>
                                          </div>
                                          {fund.deadline && (
                                            <Badge
                                              variant="outline"
                                              className="shrink-0"
                                            >
                                              Due{" "}
                                              {new Date(
                                                fund.deadline
                                              ).toLocaleDateString()}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          <span className="font-medium">
                                            Eligibility:
                                          </span>{" "}
                                          {fund.eligibility}
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )
                              )}
                            </div>
                          ) : (
                            <div className="rounded-lg border bg-card text-card-foreground p-6">
                              <div className="flex flex-col items-center text-center">
                                <PiggyBank className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  No funding opportunities are available right
                                  now.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span>{business.location.address}</span>
                    </div>
                    <div className="h-[400px] rounded-lg overflow-hidden border">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerClassName="w-full h-full"
                          center={{
                            lat: business.location.latitude,
                            lng: business.location.longitude,
                          }}
                          zoom={15}
                          options={{
                            center: {
                              lat: business.location.latitude,
                              lng: business.location.longitude,
                            },
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
                          }}
                        >
                          <MarkerF
                            position={{
                              lat: business.location.latitude,
                              lng: business.location.longitude,
                            }}
                            title={business.name}
                            animation={google.maps.Animation.DROP}
                          />
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <MapIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* News Tab */}
              <TabsContent value="news">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News & Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!business.news || business.news.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No News Available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Check back later for news and updates from this
                          business.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {business.news.map((item, index) => (
                          <div key={index} className="space-y-4">
                            {index > 0 && <Separator />}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                  {item.headline}
                                </h3>
                                <Badge variant="outline">
                                  {new Date(item.date).toLocaleDateString()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              {item.link && (
                                <Button variant="link" className="p-0" asChild>
                                  <Link href={item.link} target="_blank">
                                    Read More
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features & Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                {business.features && business.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {business.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      No features or amenities listed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Opening Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="text-sm font-medium">
                      {business.openingHours?.weekday}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Weekend</span>
                    <span className="text-sm font-medium">
                      {business.openingHours?.weekend || "Closed"}
                    </span>
                  </div>
                  {business.openingHours?.holidays && (
                    <div className="flex justify-between">
                      <span className="text-sm">Holidays</span>
                      <span className="text-sm font-medium">
                        {business.openingHours.holidays}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Combined Contact & Social */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Social</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Info */}
                {!business.contact.phone &&
                !business.contact.email &&
                !business.contact.website ? (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      No contact information available
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {business.contact.phone && business.contact.phone == "" && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-4 w-4 text-primary" />
                        <a
                          href={`tel:${business.contact.phone}`}
                          className="text-sm hover:underline"
                        >
                          {business.contact.phone}
                        </a>
                      </div>
                    )}
                    {business.contact.email &&
                      business.contact.email !== "" && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-primary" />
                          <a
                            href={`mailto:${business.contact.email}`}
                            className="text-sm hover:underline"
                          >
                            {business.contact.email}
                          </a>
                        </div>
                      )}
                    {business.contact.website &&
                      business.contact.website == "" && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-primary" />
                          <a
                            href={business.contact.website}
                            target="_blank"
                            className="text-sm hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                  </div>
                )}

                {/* Social Media */}
                <Separator />
                {business.contact.socialMedia &&
                (business.contact.socialMedia.facebook?.trim() ||
                  business.contact.socialMedia.twitter?.trim()) ? (
                  <div className="flex gap-2">
                    {business.contact.socialMedia.facebook?.trim() && (
                      <Link
                        href={business.contact.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon">
                          <Facebook className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {business.contact.socialMedia.twitter?.trim() && (
                      <Link
                        href={business.contact.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="icon">
                          <Twitter className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      No social media links available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] h-[90vh] p-0">
          <DialogTitle className="sr-only">View Image</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected image"
              fill
              className="object-contain"
              priority
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
