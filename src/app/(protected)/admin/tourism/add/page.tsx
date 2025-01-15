"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/shared/combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/shared/location-picker";
import { TagInput } from "@/components/shared/tag-input";
import { CgSpinner } from "react-icons/cg";
import { TourismType } from "@/types/tourism";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTourism } from "@/lib/api/tourism";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { TimePickerInput } from "@/components/shared/time-picker";
import { X } from "lucide-react";

const locationTypes = [
  { label: "Amusement Park", value: "amusement_park" },
  { label: "Aquarium", value: "aquarium" },
  { label: "Art Gallery", value: "art_gallery" },
  { label: "Museum", value: "museum" },
  { label: "Park", value: "park" },
  { label: "Tourist Attraction", value: "tourist_attraction" },
  { label: "Zoo", value: "zoo" },
  { label: "Embassy", value: "embassy" },
  { label: "Fire Station", value: "fire_station" },
  { label: "Police", value: "police" },
  { label: "Gym", value: "gym" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Hospital", value: "hospital" },
  { label: "Train Station", value: "train_station" },
  { label: "Subway Station", value: "subway_station" },
  { label: "Bus Station", value: "bus_station" },
  { label: "Taxi Stand", value: "taxi_stand" },
  { label: "Parking", value: "parking" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Cafe", value: "cafe" },
  { label: "Supermarket", value: "supermarket" },
  { label: "Bank", value: "bank" },
  { label: "ATM", value: "atm" },
  { label: "Shopping Mall", value: "shopping_mall" },
  { label: "Lodging", value: "lodging" },
];

const accessibilitySuggestions = [
  "Wheelchair Access",
  "Elevator",
  "Accessible Parking",
  "Accessible Restroom",
  "Braille Signage",
  "Audio Guides",
  "Service Animals Welcome",
  "Step-free Access",
  "Wide Doorways",
  "Tactile Displays",
  "Hearing Loop System",
  "Accessible Routes",
  "Visual Alarms",
  "Handrails",
  "Low Counter",
];

const facilitiesSuggestions = [
  "Free Wi-Fi",
  "Restrooms",
  "Parking",
  "Restaurant",
  "Cafe",
  "Gift Shop",
  "Information Desk",
  "First Aid Station",
  "ATM",
  "Locker Storage",
  "Tour Guide Service",
  "Baby Change Room",
  "Prayer Room",
  "Lost and Found",
  "Security Service",
  "Phone Charging Station",
  "Water Fountain",
  "Photography Area",
  "Rest Area",
  "Luggage Storage",
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum([
    "amusement_park",
    "aquarium",
    "art_gallery",
    "museum",
    "park",
    "tourist_attraction",
    "zoo",
    "embassy",
    "fire_station",
    "police",
    "gym",
    "pharmacy",
    "hospital",
    "train_station",
    "subway_station",
    "bus_station",
    "taxi_stand",
    "parking",
    "restaurant",
    "cafe",
    "supermarket",
    "bank",
    "atm",
    "shopping_mall",
    "lodging",
  ]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters."),
    latitude: z.number(),
    longitude: z.number(),
  }),
  photos: z.array(z.string()).min(1, "At least one photo is required."),
  accessibility: z.array(z.string()),
  facilities: z.array(z.string()),
  contact: z.object({
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
  }),
  openingHours: z.object({
    weekday: z.string().min(5, "Hours must be at least 5 characters"),
    weekend: z.string().min(5, "Hours must be at least 5 characters"),
  }),
  landmarks: z.array(
    z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      distance: z.number().min(0, "Distance must be positive"),
      type: z.enum([
        "amusement_park",
        "aquarium",
        "art_gallery",
        "museum",
        "park",
        "tourist_attraction",
        "zoo",
        "embassy",
        "fire_station",
        "police",
        "gym",
        "pharmacy",
        "hospital",
        "train_station",
        "subway_station",
        "bus_station",
        "taxi_stand",
        "parking",
        "restaurant",
        "cafe",
        "supermarket",
        "bank",
        "atm",
        "shopping_mall",
        "lodging",
      ]),
    })
  ),
});

export default function AddLocationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isVerifying, setVerifying] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "tourist_attraction",
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
      photos: [],
      accessibility: [],
      facilities: [],
      contact: {
        phone: "",
        email: "",
        website: "",
      },
      openingHours: {
        weekday: "",
        weekend: "",
      },
      landmarks: [],
    },
  });

  const isFieldsDisabled = React.useMemo(() => isVerifying, [isVerifying]);

  const { mutate: saveTourism } = useMutation({
    mutationFn: createTourism,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["tourism"] });
      toast({
        title: "Success",
        description: "Location created successfully.",
      });
      router.push("/admin/tourism");
    },
    onError: (error) => {
      console.error("Error saving location:", error);
      toast({
        title: "Error",
        description: "Failed to create location. Please try again. ",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setVerifying(true);
    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
      toast({
        title: "Invalid fields",
        description: "Please check the fields and try again.",
      });
      setVerifying(false);
      return;
    }
    try {
      const tourism: TourismType = {
        id: "",
        name: values.name,
        type: values.type,
        description: values.description,
        location: values.location,
        photos: values.photos,
        accessibility: values.accessibility,
        facilities: values.facilities,
        contact: values.contact,
        rating: 0,
        userRatingCount: 0,
        openingHours: values.openingHours,
        createdAt: new Date().toISOString(),
        landmarks: values.landmarks,
      };

      saveTourism(tourism);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  }

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex-1 ml-4 border-t border-gray-200" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Location</CardTitle>
        <CardDescription>
          Create a new tourist location with all the necessary details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              {renderSectionHeader("Basic Information")}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Location name"
                          {...field}
                          disabled={isFieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Combobox
                          options={locationTypes}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select location type"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter location description"
                        {...field}
                        disabled={isFieldsDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Photos */}
            <div className="space-y-4">
              {renderSectionHeader("Photos")}
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Photos</FormLabel>
                    <FormControl>
                      <div className="grid gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            const newFiles: string[] = [];

                            for (const file of files) {
                              // Only allow image files
                              if (!file.type.startsWith("image/")) {
                                continue;
                              }

                              try {
                                // Convert file to base64 string
                                const reader = new FileReader();
                                await new Promise((resolve) => {
                                  reader.onload = (e) => {
                                    const base64String = e.target
                                      ?.result as string;
                                    newFiles.push(base64String);
                                    resolve(null);
                                  };
                                  reader.readAsDataURL(file);
                                });
                              } catch (error) {
                                console.error("Error processing file:", error);
                              }
                            }

                            field.onChange([
                              ...(field.value || []),
                              ...newFiles,
                            ]);
                          }}
                          disabled={isFieldsDisabled}
                        />
                        <div className="grid grid-cols-3 gap-4">
                          {field.value?.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const newPhotos = [...(field.value || [])];
                                  newPhotos.splice(index, 1);
                                  field.onChange(newPhotos);
                                }}
                                disabled={isFieldsDisabled}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              {renderSectionHeader("Location")}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <LocationPicker
                        onLocationSelect={(location) => {
                          field.onChange({
                            address: location.address,
                            latitude: location.lat,
                            longitude: location.lng,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {renderSectionHeader("Contact Information")}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          disabled={isFieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                          disabled={isFieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter website URL"
                          {...field}
                          disabled={isFieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-4">
              {renderSectionHeader("Opening Hours")}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <FormLabel>Weekday Hours</FormLabel>
                  <div className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name="openingHours.weekday"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex gap-2 items-center">
                              <TimePickerInput
                                placeholder="Opening time"
                                value={field.value.split(" - ")[0]}
                                onChange={(time) => {
                                  const closing =
                                    field.value.split(" - ")[1] || "";
                                  field.onChange(
                                    `${time}${closing ? ` - ${closing}` : ""}`
                                  );
                                }}
                                disabled={isFieldsDisabled}
                              />
                              <span>-</span>
                              <TimePickerInput
                                placeholder="Closing time"
                                value={field.value.split(" - ")[1]}
                                onChange={(time) => {
                                  const opening =
                                    field.value.split(" - ")[0] || "";
                                  field.onChange(
                                    `${opening ? `${opening} - ` : ""}${time}`
                                  );
                                }}
                                disabled={isFieldsDisabled}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <FormLabel>Weekend Hours</FormLabel>
                  <div className="flex gap-4 items-center">
                    <FormField
                      control={form.control}
                      name="openingHours.weekend"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex gap-2 items-center">
                              <TimePickerInput
                                placeholder="Opening time"
                                value={field.value.split(" - ")[0]}
                                onChange={(time) => {
                                  const closing =
                                    field.value.split(" - ")[1] || "";
                                  field.onChange(
                                    `${time}${closing ? ` - ${closing}` : ""}`
                                  );
                                }}
                                disabled={isFieldsDisabled}
                              />
                              <span>-</span>
                              <TimePickerInput
                                placeholder="Closing time"
                                value={field.value.split(" - ")[1]}
                                onChange={(time) => {
                                  const opening =
                                    field.value.split(" - ")[0] || "";
                                  field.onChange(
                                    `${opening ? `${opening} - ` : ""}${time}`
                                  );
                                }}
                                disabled={isFieldsDisabled}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              {renderSectionHeader("Accessibility & Facilities")}
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="accessibility"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibility Features</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add accessibility features"
                          suggestions={accessibilitySuggestions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilities"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facilities</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add facilities"
                          suggestions={facilitiesSuggestions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Landmarks Section */}
            <div className="space-y-4">
              {renderSectionHeader("Nearby Landmarks")}
              <FormField
                control={form.control}
                name="landmarks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value.map((_, index) => (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="grid gap-4 flex-1 grid-cols-1 lg:grid-cols-3">
                              <FormField
                                control={form.control}
                                name={`landmarks.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Landmark Name</FormLabel>
                                    <div className="flex items-center gap-2">
                                      <FormControl>
                                        <Input
                                          placeholder="Landmark name"
                                          {...field}
                                          disabled={isFieldsDisabled}
                                        />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`landmarks.${index}.distance`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Distance (meters)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Distance (meters)"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(Number(e.target.value))
                                        }
                                        disabled={isFieldsDisabled}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`landmarks.${index}.type`}
                                disabled={isFieldsDisabled}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Landmark Type</FormLabel>
                                    <FormControl>
                                      <Combobox
                                        options={locationTypes}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        placeholder="Select type"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="mt-8"
                              disabled={isFieldsDisabled}
                              onClick={() => {
                                const newLandmarks = [...field.value];
                                newLandmarks.splice(index, 1);
                                field.onChange(newLandmarks);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isFieldsDisabled}
                          onClick={() => {
                            field.onChange([
                              ...field.value,
                              {
                                name: "",
                                distance: 0,
                                type: "tourist_attraction",
                              },
                            ]);
                          }}
                        >
                          Add Landmark
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isFieldsDisabled}
              >
                {isFieldsDisabled && (
                  <CgSpinner className="animate-spin mr-2" />
                )}
                Create Location
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
