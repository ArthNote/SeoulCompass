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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LocationPicker } from "@/components/shared/location-picker";
import { TagInput } from "@/components/shared/tag-input";
import { CgSpinner } from "react-icons/cg";
import { BusinessType } from "@/types/business";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusiness } from "@/lib/api/business";
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { TimePickerInput } from "@/components/shared/time-picker";
import { X } from "lucide-react";
import { DatePicker } from "@/components/shared/date-picker";

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

const featureSuggestions = [
  "Free Wi-Fi",
  "Meeting Rooms",
  "Conference Facilities",
  "24/7 Access",
  "Security",
  "Parking",
  "Cafeteria",
  "Printing Services",
  "Mail Handling",
  "Event Space",
  "Lounge Area",
  "Kitchen",
  "Phone Booths",
  "Storage Space",
  "Bike Storage",
  "Shower Facilities",
  "Pet Friendly",
  "Outdoor Space",
  "Gym",
  "Cleaning Service",
];

const tagSuggestions = [
  "Startup Friendly",
  "Tech Hub",
  "Creative Space",
  "Professional",
  "Eco-friendly",
  "Innovation",
  "Networking",
  "Coworking",
  "Enterprise",
  "Digital",
  "Research",
  "Development",
  "Training",
  "Incubator",
  "Accelerator",
];

const formatCurrency = (value: string) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

const parseCurrencyString = (value: string) => {
  const parsed = value.replace(/[^0-9.-]+/g, "");
  const number = parseFloat(parsed);
  return isNaN(number) ? 0 : number;
};

const mentorTypeSuggestions = [
  "Business Development",
  "Technical",
  "Marketing",
  "Financial",
  "Leadership",
  "Industry Expert",
  "Startup Mentor",
  "Career Coach",
  "Executive Mentor",
  "Product Development",
  "Sales",
  "Operations",
  "Strategy",
  "Innovation",
  "Research",
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum(["business_center", "industry", "event", "opportunity"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters."),
    latitude: z.number(),
    longitude: z.number(),
  }),
  category: z.enum([
    "technology",
    "finance",
    "manufacturing",
    "hospitality",
    "healthcare",
    "education",
    "retail",
    "media",
    "construction",
    "transportation",
    "energy",
    "agriculture",
    "entertainment",
  ]),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  contact: z.object({
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Invalid email").optional(),
    website: z.string().url("Invalid URL").optional(),
    socialMedia: z
      .object({
        linkedIn: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
      })
      .optional(),
  }),
  opportunities: z
    .object({
      mentorshipPrograms: z
        .array(
          z.object({
            name: z.string().min(2),
            description: z.string().min(10),
            mentorType: z.string(),
            duration: z.string().optional(),
            eligibility: z.string(),
          })
        )
        .optional(),
      networkingEvents: z
        .array(
          z.object({
            name: z.string().min(2),
            description: z.string().min(10),
            date: z.string(),
            location: z.string(),
            registrationLink: z.string().url().optional(),
          })
        )
        .optional(),
      partnerships: z
        .array(
          z.object({
            name: z.string().min(2),
            description: z.string().min(10),
            contactEmail: z.string().email(),
          })
        )
        .optional(),
      funding: z
        .array(
          z.object({
            name: z.string().min(2),
            amount: z.number().min(0),
            eligibility: z.string(),
            deadline: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  news: z
    .array(
      z.object({
        headline: z.string().min(2),
        description: z.string().min(10),
        date: z.string(),
        link: z.string().url(),
      })
    )
    .optional(),
  photos: z.array(z.string()).optional(),
  openingHours: z.object({
    weekday: z.string(),
    weekend: z.string().optional(),
    holidays: z.string().optional(),
  }),
});

export default function AddBusinessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isVerifying, setVerifying] = useState(false);
  const isFieldsDisabled = React.useMemo(() => isVerifying, [isVerifying]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "business_center",
      description: "",
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
      category: "technology",
      tags: [],
      features: [],
      contact: {
        phone: "",
        email: "",
        website: "",
        socialMedia: {
          linkedIn: "",
          facebook: "",
          twitter: "",
          instagram: "",
        },
      },
      photos: [],
      openingHours: {
        weekday: "",
        weekend: "",
        holidays: "",
      },
      opportunities: {
        mentorshipPrograms: [],
        networkingEvents: [],
        partnerships: [],
        funding: [],
      },
      news: [],
    },
  });

  const { mutate: saveBusiness } = useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast({
        title: "Success",
        description: "Business created successfully.",
      });
      router.push("/admin/business");
    },
    onError: (error) => {
      console.error("Error saving business:", error);
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setVerifying(true);
    try {
      const business: BusinessType = {
        id: "",
        ...values,
        opportunities: {
          ...values.opportunities,
          funding: values.opportunities?.funding?.map((fund) => ({
            ...fund,
            amount: fund.amount.toString(),
          })),
        },
        createdAt: new Date().toISOString(),
      };
      saveBusiness(business);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create business. Please try again.",
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
        <CardTitle>Add New Business</CardTitle>
        <CardDescription>
          Create a new business with all details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              {renderSectionHeader("Basic Information")}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Name field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Business name"
                          {...field}
                          disabled={isFieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type field */}
                <FormField
                  control={form.control}
                  name="type"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Combobox
                          options={types}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select business type"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category field */}
                <FormField
                  control={form.control}
                  name="category"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Combobox
                          options={industries}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select industry"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Business description"
                        {...field}
                        disabled={isFieldsDisabled}
                      />
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
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
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
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
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
                      <FormLabel>Website (Optional)</FormLabel>
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

            {/* Social Media Section */}
            <div className="space-y-4">
              {renderSectionHeader("Social Media")}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contact.socialMedia.linkedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LinkedIn URL"
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
                  name="contact.socialMedia.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Facebook URL"
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
                  name="contact.socialMedia.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Twitter URL"
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
                  name="contact.socialMedia.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Instagram URL"
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
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="openingHours.weekday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekday Hours</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <TimePickerInput
                            placeholder="Opening time"
                            value={field.value.split(" - ")[0]}
                            onChange={(time) => {
                              const closing = field.value.split(" - ")[1] || "";
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
                              const opening = field.value.split(" - ")[0] || "";
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

                <FormField
                  control={form.control}
                  name="openingHours.weekend"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekend Hours (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <TimePickerInput
                            placeholder="Opening time"
                            value={field.value?.split(" - ")[0]}
                            onChange={(time) => {
                              const closing =
                                field.value?.split(" - ")[1] || "";
                              field.onChange(
                                `${time}${closing ? ` - ${closing}` : ""}`
                              );
                            }}
                            disabled={isFieldsDisabled}
                          />
                          <span>-</span>
                          <TimePickerInput
                            placeholder="Closing time"
                            value={field.value?.split(" - ")[1]}
                            onChange={(time) => {
                              const opening =
                                field.value?.split(" - ")[0] || "";
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

                <FormField
                  control={form.control}
                  name="openingHours.holidays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holiday Hours (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <TimePickerInput
                            placeholder="Opening time"
                            value={field.value?.split(" - ")[0]}
                            onChange={(time) => {
                              const closing =
                                field.value?.split(" - ")[1] || "";
                              field.onChange(
                                `${time}${closing ? ` - ${closing}` : ""}`
                              );
                            }}
                            disabled={isFieldsDisabled}
                          />
                          <span>-</span>
                          <TimePickerInput
                            placeholder="Closing time"
                            value={field.value?.split(" - ")[1]}
                            onChange={(time) => {
                              const opening =
                                field.value?.split(" - ")[0] || "";
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

            {/* Features & Tags */}
            <div className="space-y-4">
              {renderSectionHeader("Features & Tags")}
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="features"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add features"
                          suggestions={featureSuggestions}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  disabled={isFieldsDisabled}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add tags"
                          suggestions={tagSuggestions}
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
                    <FormLabel>Upload Photos</FormLabel>
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
                              if (!file.type.startsWith("image/")) continue;
                              try {
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

            {/* Opportunities Section */}
            <div className="space-y-4">
              {renderSectionHeader("Business Opportunities")}

              {/* Mentorship Programs */}
              <FormField
                control={form.control}
                name="opportunities.mentorshipPrograms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentorship Programs</FormLabel>
                    <div className="space-y-4">
                      {field.value?.map((_, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newPrograms = [...(field.value || [])];
                              newPrograms.splice(index, 1);
                              field.onChange(newPrograms);
                            }}
                            disabled={isFieldsDisabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`opportunities.mentorshipPrograms.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Program Name</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.mentorshipPrograms.${index}.mentorType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Mentor Type</FormLabel>
                                  <FormControl>
                                    <Combobox
                                      options={mentorTypeSuggestions.map(
                                        (type) => ({
                                          label: type,
                                          value: type
                                            .toLowerCase()
                                            .replace(/\s+/g, "_"),
                                        })
                                      )}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      placeholder="Select mentor type"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`opportunities.mentorshipPrograms.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
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
                              name={`opportunities.mentorshipPrograms.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.mentorshipPrograms.${index}.eligibility`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Eligibility</FormLabel>
                                  <FormControl>
                                    <Input
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
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isFieldsDisabled}
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            {
                              name: "",
                              description: "",
                              mentorType: "",
                              duration: "",
                              eligibility: "",
                            },
                          ]);
                        }}
                      >
                        Add Mentorship Program
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Networking Events */}
              <FormField
                control={form.control}
                name="opportunities.networkingEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Networking Events</FormLabel>
                    <div className="space-y-4">
                      {field.value?.map((_, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newEvents = [...(field.value || [])];
                              newEvents.splice(index, 1);
                              field.onChange(newEvents);
                            }}
                            disabled={isFieldsDisabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`opportunities.networkingEvents.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Event Name</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.networkingEvents.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Event Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onChange={(date) => {
                                        if (date) {
                                          const localDate = new Date(
                                            date.getTime() -
                                              date.getTimezoneOffset() * 60000
                                          );
                                          field.onChange(
                                            localDate
                                              .toISOString()
                                              .split("T")[0]
                                          );
                                        } else {
                                          field.onChange("");
                                        }
                                      }}
                                      disabled={isFieldsDisabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`opportunities.networkingEvents.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
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
                              name={`opportunities.networkingEvents.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Event Location</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.networkingEvents.${index}.registrationLink`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Registration Link (Optional)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isFieldsDisabled}
                                      placeholder="https://"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isFieldsDisabled}
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            {
                              name: "",
                              description: "",
                              date: "",
                              location: "",
                              registrationLink: "",
                            },
                          ]);
                        }}
                      >
                        Add Networking Event
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Partnerships */}
              <FormField
                control={form.control}
                name="opportunities.partnerships"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partnerships</FormLabel>
                    <div className="space-y-4">
                      {field.value?.map((_, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newPartnerships = [...(field.value || [])];
                              newPartnerships.splice(index, 1);
                              field.onChange(newPartnerships);
                            }}
                            disabled={isFieldsDisabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`opportunities.partnerships.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Partnership Name</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.partnerships.${index}.contactEmail`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
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
                              name={`opportunities.partnerships.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
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
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isFieldsDisabled}
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            {
                              name: "",
                              description: "",
                              contactEmail: "",
                            },
                          ]);
                        }}
                      >
                        Add Partnership
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Funding */}
              <FormField
                control={form.control}
                name="opportunities.funding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Opportunities</FormLabel>
                    <div className="space-y-4">
                      {field.value?.map((_, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newFunding = [...(field.value || [])];
                              newFunding.splice(index, 1);
                              field.onChange(newFunding);
                            }}
                            disabled={isFieldsDisabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`opportunities.funding.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Funding Name</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.funding.${index}.amount`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseCurrencyString(
                                          e.target.value
                                        );
                                        field.onChange(value);
                                      }}
                                      value={formatCurrency(
                                        field.value.toString()
                                      )}
                                      placeholder="$0.00"
                                      disabled={isFieldsDisabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`opportunities.funding.${index}.eligibility`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Eligibility</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`opportunities.funding.${index}.deadline`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Deadline (Optional)</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onChange={(date) => {
                                        if (date) {
                                          const localDate = new Date(
                                            date.getTime() -
                                              date.getTimezoneOffset() * 60000
                                          );
                                          field.onChange(
                                            localDate
                                              .toISOString()
                                              .split("T")[0]
                                          );
                                        } else {
                                          field.onChange("");
                                        }
                                      }}
                                      disabled={isFieldsDisabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isFieldsDisabled}
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            {
                              name: "",
                              amount: "",
                              eligibility: "",
                              deadline: "",
                            },
                          ]);
                        }}
                      >
                        Add Funding Opportunity
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* News Section */}
            <div className="mt-6">
              {renderSectionHeader("News & Updates")}
              <FormField
                control={form.control}
                name="news"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>News Items</FormLabel>
                    <div className="space-y-4">
                      {field.value?.map((_, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg relative"
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newNews = [...(field.value || [])];
                              newNews.splice(index, 1);
                              field.onChange(newNews);
                            }}
                            disabled={isFieldsDisabled}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name={`news.${index}.headline`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Headline</FormLabel>
                                  <FormControl>
                                    <Input
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
                              name={`news.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
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
                              name={`news.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <DatePicker
                                      value={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onChange={(date) => {
                                        if (date) {
                                          const localDate = new Date(
                                            date.getTime() -
                                              date.getTimezoneOffset() * 60000
                                          );
                                          field.onChange(
                                            localDate
                                              .toISOString()
                                              .split("T")[0]
                                          );
                                        } else {
                                          field.onChange("");
                                        }
                                      }}
                                      disabled={isFieldsDisabled}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`news.${index}.link`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Link</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isFieldsDisabled}
                                      placeholder="https://"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isFieldsDisabled}
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            {
                              headline: "",
                              description: "",
                              date: "",
                              link: "",
                            },
                          ]);
                        }}
                      >
                        Add News Item
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isFieldsDisabled}
              >
                {isFieldsDisabled && (
                  <CgSpinner className="animate-spin mr-2" />
                )}
                Create Business
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
