"use client";

import React, { useState, useEffect, useCallback, Suspense, use } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  MapIcon,
  PhoneIcon,
  ArrowLeftIcon,
  Clock,
  Share2,
  BookmarkPlus,
  ChevronRight,
  Camera,
  MessageCircle,
  Heart,
  Navigation,
  InfoIcon,
  SunIcon,
  Sunrise as SunriseIcon,
  Sunset,
  Umbrella,
  Droplets,
  ChevronLeft,
  Navigation2,
  Ban,
  CalendarDays,
  UsersRound,
  Utensils,
  Train,
  Landmark,
  X,
  Facebook,
  Twitter,
  Link2,
  Mail,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import { cn, delay } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTourismById } from "@/lib/api/tourism";
import { TourismType } from "@/types/tourism";
import ViewTourismLoading from "./loading";
import { ErrorState } from "@/components/shared/error-state";
import {
  createFavorite,
  deleteFavoriteByItemId,
  favoriteExists,
} from "@/lib/api/favorite";
import { CgSpinner } from "react-icons/cg";
import { useAuth } from "@clerk/nextjs";

// Reuse the map styles and bounds from the main tourism page

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

const mockReviews = [
  {
    id: 1,
    user: { name: "John D.", image: "https://i.pravatar.cc/150?img=1" },
    rating: 5,
    date: "2024-02-15",
    comment:
      "Amazing place! The food was incredible and the atmosphere was perfect.",
  },
  {
    id: 2,
    user: { name: "Sarah M.", image: "https://i.pravatar.cc/150?img=2" },
    rating: 4,
    date: "2024-02-10",
    comment: "Great location, but can get quite crowded during peak hours.",
  },
];

const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const convertTo24Hour = (timeStr: string) => {
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

const isCurrentlyOpen = (resource: TourismType) => {
  if (!resource?.openingHours) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;

  const schedule = isWeekend(now)
    ? resource.openingHours.weekend
    : resource.openingHours.weekday;

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

const getNextOpenTime = (resource: TourismType) => {
  if (!resource?.openingHours) return "N/A";

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedule = isWeekend(tomorrow)
    ? resource.openingHours.weekend
    : resource.openingHours.weekday;

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

// Add this helper function before the page component
const groupLandmarksByType = (
  landmarks: Array<{ name: string; distance: number; type: string }>
) => {
  return landmarks.reduce((groups, landmark) => {
    const type = landmark.type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(landmark);
    return groups;
  }, {} as Record<string, typeof landmarks>);
};

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    if (!id) {
      redirect("/user/tourism");
    }
  }, [id]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const {
    data: tourism,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tourism", id],
    queryFn: () => getTourismById(id),
    enabled: !!id,
  });

  const queryClient = useQueryClient();

  const { mutate: addToFavorite, isPending } = useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["tourism-favorited", tourism?.id],
      });
      toast({
        title: "Success",
        description: "Location added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add location to favorites",
        variant: "destructive",
      });
    },
  });

  const [isFavorited, setIsFavorited] = useState(false);

  // Add this query to check if job is favorited
  const { data: isJobFavorited } = useQuery({
    queryKey: ["tourism-favorited", tourism?.id],
    queryFn: () => favoriteExists(tourism?.id as string, userId as string),
    enabled: !!tourism?.id,
  });

  useEffect(() => {
    if (isJobFavorited !== undefined) {
      setIsFavorited(isJobFavorited);
    }
  }, [isJobFavorited]);

  const { mutate: removeFromFavorite, isPending: isRemoving } = useMutation({
    mutationFn: () =>
      deleteFavoriteByItemId(tourism?.id as string, userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({
        queryKey: ["tourism-favorited", tourism?.id],
      });
      setIsFavorited(false);
      toast({
        title: "Success",
        description: "Location removed from favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove location from favorites",
        variant: "destructive",
      });
    },
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const nextImage = () => {
    if (tourism?.photos) {
      setCurrentImageIndex((prev) => (prev + 1) % tourism.photos!.length);
    }
  };

  const prevImage = () => {
    if (tourism?.photos) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + tourism.photos!.length) % tourism.photos!.length
      );
    }
  };

  // Auto-advance images
  useEffect(() => {
    if (tourism?.photos && tourism.photos.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % tourism.photos!.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [tourism?.photos]);

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
    if (tourism) {
      const destination = `${tourism.location.latitude},${tourism.location.latitude}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`;
      window.open(url, "_blank");
    }
  };

  if (!tourism)
    return (
      <ErrorState
        title="Error loading tourism"
        description="Failed to load tourism details"
        retryAction={() => refetch()}
      />
    );

  if (isLoading) return <ViewTourismLoading />;
  if (isError)
    return (
      <ErrorState
        title="Error loading tourism"
        description="Failed to load tourism details"
        retryAction={() => refetch()}
      />
    );

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Sticky Navigation */}
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
                    Share this location
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
                    itemId: tourism.id,
                    name: tourism.name,
                    description: tourism.description,
                    module: "tourism",
                    userId: userId as string,
                    type: tourism.type,
                    address: tourism.location.address,
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative h-[400px] rounded-lg overflow-hidden group">
              {tourism?.photos && tourism.photos.length > 0 ? (
                <>
                  {tourism.photos.map((src, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <div
                        className="absolute inset-0 z-20 cursor-pointer"
                        onClick={() => setSelectedImage(src)}
                      />
                      <Image
                        src={src}
                        alt={`Location image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* Image indicators - Only show if multiple photos exist */}
                  {tourism.photos.length > 1 && (
                    <>
                      <div className="absolute bottom-4 left-6 right-6 flex justify-center gap-2 z-20">
                        {tourism.photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white w-4"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Navigation arrows - Only show if multiple photos exist */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-30"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center">
                  <Camera className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground font-medium">
                    No photos available
                  </p>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-7" />

              {/* Title and info */}
              <div className="absolute bottom-5 left-0 right-0 p-6 z-10">
                <h1 className="text-white text-3xl font-bold mb-3">
                  {tourism?.name}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {tourism?.type.replace("_", " ").toUpperCase()}
                  </Badge>
                  <div className="flex items-center bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-white font-medium">
                      {tourism?.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <Tabs defaultValue="about" className="space-y-4">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-lg leading-relaxed">
                      {tourism?.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3">
                        <MapIcon className="h-5 w-5 text-primary" />
                        <span>{tourism?.location.address}</span>
                      </div>
                      {tourism?.contact.phone && (
                        <div className="flex items-center gap-3">
                          <PhoneIcon className="h-5 w-5 text-primary" />
                          <span>{tourism.contact.phone}</span>
                        </div>
                      )}
                      {tourism?.contact.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <Link
                            href={`mailto:${tourism.contact.email}`}
                            className="hover:underline"
                          >
                            {tourism.contact.email}
                          </Link>
                        </div>
                      )}
                      {tourism?.contact.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-primary" />
                          <Link
                            href={tourism.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Visit Website
                          </Link>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Reviews</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on {mockReviews.length} reviews
                        </p>
                      </div>
                      <Button>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Write a Review
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.user.image} />
                              <AvatarFallback>
                                {review.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-400">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-current"
                                      : "stroke-current fill-none"
                                  }`}
                                />
                              ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {review.comment}
                        </p>
                        <Separator />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map">
                <Card>
                  <CardContent className="p-0">
                    <div className="h-[400px]">
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerClassName="w-full h-full"
                          center={{
                            lat: tourism?.location.latitude || 37.5665,
                            lng: tourism?.location.longitude || 126.978,
                          }}
                          zoom={15}
                          options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: true,
                            zoomControl: true,
                            styles: [
                              ...mapStyles,
                              {
                                featureType: "all",
                                elementType: "labels.text.fill",
                                stylers: [],
                              },
                            ],
                            disableDefaultUI: false,
                            clickableIcons: false,
                            restriction: {
                              latLngBounds: SEOUL_BOUNDS,
                              strictBounds: true,
                            },
                            minZoom: 11,
                            maxZoom: 18,
                          }}
                        >
                          {tourism && (
                            <MarkerF
                              position={{
                                lat: tourism.location.latitude,
                                lng: tourism.location.longitude,
                              }}
                              title={tourism.name}
                            />
                          )}
                        </GoogleMap>
                      ) : (
                        <div className="w-full h-full bg-muted animate-pulse" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Features & Amenities Card */}
            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tourism.accessibility.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Accessibility</h3>
                    <div className="flex flex-wrap gap-2">
                      {tourism.accessibility.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tourism.facilities && tourism.facilities.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">
                      Available Facilities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tourism.facilities.map((facility, index) => (
                        <Badge key={index} variant="outline">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Opening Hours
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        isCurrentlyOpen(tourism) ? "default" : "secondary"
                      }
                      className={`${
                        isCurrentlyOpen(tourism)
                          ? "bg-green-500/15 text-green-500 hover:bg-green-500/25"
                          : "bg-red-500/15 text-red-500 hover:bg-red-500/25"
                      }`}
                    >
                      {isCurrentlyOpen(tourism) ? "Open Now" : "Closed"}
                    </Badge>
                  </div>
                </div>
                {!isCurrentlyOpen(tourism) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Opens tomorrow at {getNextOpenTime(tourism)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">Monday - Friday</span>
                    <span className="text-sm text-muted-foreground">
                      {tourism.openingHours.weekday}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium">
                      Saturday - Sunday
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tourism.openingHours.weekend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Nearby Places
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {tourism.landmarks.length > 0 ? (
                  Object.entries(groupLandmarksByType(tourism.landmarks)).map(
                    ([type, landmarks]) => (
                      <div key={type} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-primary" />
                          <h3 className="font-medium">{type}</h3>
                        </div>
                        <div className="space-y-2">
                          {landmarks.map((landmark, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm pl-6"
                            >
                              <span>{landmark.name}</span>
                              <span className="text-muted-foreground">
                                {landmark.distance}m
                              </span>
                            </div>
                          ))}
                        </div>
                        {type !==
                          Object.keys(
                            groupLandmarksByType(tourism.landmarks)
                          ).pop() && <Separator className="my-4" />}
                      </div>
                    )
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Ban className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground font-medium">
                      No nearby places found
                    </p>
                    <p className="text-sm text-muted-foreground/75">
                      There are currently no registered landmarks near this
                      location
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Image Viewer Dialog */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
          <DialogContent className="max-w-[95vw] sm:max-w-[85vw] h-[90vh] p-0 border-none [&>button]:hidden">
            <DialogTitle></DialogTitle>
            {/* Custom Close Button */}
            <div className="absolute top-0 right-0 z-50 p-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full w-10 h-10 bg-muted  backdrop-blur-sm border-none"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5 " />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="w-full h-full flex items-center justify-center">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Location image"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default page;
