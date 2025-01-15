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
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/shared/combobox";
import { LocationPicker } from "@/components/shared/location-picker";
import { TimePickerInput } from "@/components/shared/time-picker";
import { TagInput } from "@/components/shared/tag-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import { createStudentResource } from "@/lib/api/student-resources";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { StudentResource } from "@/types/student-resource";

const studentTypes = [
  { label: "University", value: "university" },
  { label: "Library", value: "library" },
  { label: "Secondary School", value: "secondary_school" },
  { label: "Primary School", value: "primary_school" },
  { label: "Book Store", value: "book_store" },
];

const accessibilityFeatures = [
  "Wheelchair Access",
  "Elevator",
  "Accessible Parking",
  "Accessible Restroom",
  "Study Rooms",
  "Computer Lab",
  "WiFi Available",
  "Cafeteria",
  "Library",
  "Sports Facilities",
];

const suggestedTags = [
  "International Students",
  "Language Learning",
  "Academic Support",
  "Career Services",
  "Research",
  "Cultural Exchange",
  "Student Life",
];

const suggestedResources = [
  "Textbooks",
  "Online Courses",
  "Research Papers",
  "Study Materials",
  "Language Resources",
  "Academic Journals",
  "Educational Software",
];

const suggestedFacilities = [
  "Lecture Halls",
  "Conference Rooms",
  "Study Areas",
  "Computer Labs",
  "Research Labs",
  "Auditorium",
  "Student Lounge",
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum([
    "university",
    "library",
    "secondary_school",
    "primary_school",
    "book_store",
  ]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters."),
    latitude: z.number(),
    longitude: z.number(),
  }),
  photos: z.array(z.string()),
  accessibility: z.array(z.string()),
  tags: z.array(z.string()),
  facilities: z.array(z.string()),
  resources: z.array(z.string()),
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
});

export default function AddStudentResourcePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "university",
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
      photos: [],
      accessibility: [],
      tags: [],
      resources: [],
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
    },
  });

  const { mutate: saveResource } = useMutation({
    mutationFn: createStudentResource,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["student-resources"] });
      toast({
        title: "Success",
        description: "Resource created successfully.",
      });
      router.push("/admin/student-resources");
    },
    onError: (error) => {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    },
  });

  const renderSectionHeader = (title: string) => (
    <div className="flex items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex-1 ml-4 border-t border-gray-200" />
    </div>
  );

  const isFieldsDisabled = React.useMemo(() => isSubmitting, [isSubmitting]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
      toast({
        title: "Invalid fields",
        description: "Please check the fields and try again.",
      });
      setIsSubmitting(false);
      return;
    }
    try {
      const resource: StudentResource = {
        ...values,
        id: "",
        rating: 0,
        userRatingCount: 0,
        createdAt: new Date().toISOString(),
      };
      saveResource(resource);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student Resource</CardTitle>
        <CardDescription>
          Create a new educational resource with all necessary details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
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
                          placeholder="Resource name"
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
                          options={studentTypes}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select a type..."
                          searchPlaceholder="Search types..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the resource"
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

            {/* Location Section */}
            <div className="space-y-4">
              {renderSectionHeader("Location")}
              <FormField
                control={form.control}
                name="location"
                disabled={isFieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
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

            {/* Contact Information Section */}
            <div className="space-y-4">
              {renderSectionHeader("Contact Information")}
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email address"
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
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Website URL"
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

            {/* Features & Amenities Section */}
            <div className="space-y-4">
              {renderSectionHeader("Features & Amenities")}
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  disabled={isFieldsDisabled}
                  name="accessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibility Features</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add accessibility features"
                          suggestions={accessibilityFeatures}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isFieldsDisabled}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add tags"
                          suggestions={suggestedTags}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isFieldsDisabled}
                  name="resources"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Resources</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add resources"
                          suggestions={suggestedResources}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isFieldsDisabled}
                  name="facilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Facilities</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Add facilities"
                          suggestions={suggestedFacilities}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Photos Section */}
            <div className="space-y-4">
              {renderSectionHeader("Photos")}
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isFieldsDisabled}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const newPhotos: string[] = [];

                          for (const file of files) {
                            if (!file.type.startsWith("image/")) continue;
                            const reader = new FileReader();
                            const photo = await new Promise<string>(
                              (resolve) => {
                                reader.onload = (e) =>
                                  resolve(e.target?.result as string);
                                reader.readAsDataURL(file);
                              }
                            );
                            newPhotos.push(photo);
                          }

                          field.onChange([...field.value, ...newPhotos]);
                        }}
                      />
                    </FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {field.value.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const newPhotos = [...field.value];
                              newPhotos.splice(index, 1);
                              field.onChange(newPhotos);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isFieldsDisabled}
                className="w-full"
              >
                {isFieldsDisabled && (
                  <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Resource
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
