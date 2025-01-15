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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/shared/location-picker";
import { TagsInput } from "react-tag-input-component";
import React, { useState } from "react";
import { TagInput } from "@/components/shared/tag-input";
import { delay } from "@/lib/utils";
import { createJob } from "@/lib/api/jobs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { JobType } from "@/types/job";
import { CgSpinner } from "react-icons/cg";
import { DatePicker } from "@/components/shared/date-picker";

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

const jobTypes = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Temporary", value: "temporary" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
];

const workLocations = [
  { label: "On-site", value: "onsite" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const educationLevels = [
  { label: "None", value: "none" },
  { label: "High School", value: "high school" },
  { label: "Bachelor", value: "bachelor" },
  { label: "Master", value: "master" },
  { label: "PhD", value: "phd" },
];

const weekdays = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

const benefitSuggestions = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "Paid Time Off",
  "Remote Work",
  "Flexible Hours",
  "Professional Development",
  "Gym Membership",
  "Company Events",
];

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  industry: z.enum([
    "technology",
    "finance",
    "healthcare",
    "education",
    "retail",
    "manufacturing",
    "hospitality",
    "construction",
    "media",
    "transportation",
  ]),
  type: z.enum([
    "full-time",
    "part-time",
    "contract",
    "temporary",
    "internship",
    "freelance",
  ]),
  workLocation: z.enum(["onsite", "remote", "hybrid"]),
  requirements: z.object({
    education: z.enum(["none", "high school", "bachelor", "master", "phd"]),
    experience: z.number().min(0),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
  }),
  workSchedule: z.object({
    workdays: z.object({
      from: z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]),
      to: z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]),
    }),
    workhours: z.object({
      from: z.string(),
      to: z.string(),
    }),
  }),
  benefits: z.array(z.string()),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    period: z.enum(["monthly", "yearly"]),
  }),
  contact: z.string().email("Invalid email address"),
  deadline: z.string(),
  location: z.object({
    address: z.string().min(5),
    lat: z.number(),
    lng: z.number(),
  }),
  company: z.object({
    name: z.string().min(2),
    industry: z.enum([
      "technology",
      "finance",
      "healthcare",
      "education",
      "retail",
      "manufacturing",
      "hospitality",
      "construction",
      "media",
      "transportation",
    ]),
    description: z.string().min(10),
    employees: z.number().min(1),
    website: z.string().url(),
  }),
});

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

export default function AddJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isVerifying, setVerifying] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      industry: "technology",
      type: "full-time",
      workLocation: "onsite",
      workSchedule: {
        workdays: {
          from: "monday",
          to: "friday",
        },
        workhours: {
          from: "",
          to: "",
        },
      },
      requirements: {
        experience: 0,
        education: "none",
        skills: [],
      },
      benefits: ["Health Insurance", "Paid Time Off"],
      salary: {
        min: 0,
        max: 0,
        period: "monthly",
      },
      location: {
        lat: 0,
        lng: 0,
        address: "",
      },
      company: {
        name: "",
        industry: "technology", // Add default value here
        description: "",
        employees: 1,
        website: "",
      },
    },
  });

  const isFieldsDisabled = React.useMemo(() => isVerifying, [isVerifying]);

  const {
    mutate: saveJob,
    isError,
    error,
  } = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Success",
        description: "Job created successfully.",
      });
      router.push("/admin/jobs");
    },
    retry: 3,
    onError: (error, variables) => {
      console.error("Error saving job:", error);
      console.error("not saved to db");
      console.error(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const job: JobType = {
        id: "",
        title: values.title,
        description: values.description,
        industry: values.industry,
        type: values.type,
        workLocation: values.workLocation,
        requirements: {
          education: values.requirements.education,
          experience: values.requirements.experience,
          skills: values.requirements.skills,
        },
        workSchedule: {
          workdays: {
            from: values.workSchedule.workdays.from,
            to: values.workSchedule.workdays.to,
          },
          workhours: {
            from: values.workSchedule.workhours.from,
            to: values.workSchedule.workhours.to,
          },
        },
        benefits: values.benefits,
        salary: {
          salary: `${values.salary.min} - ${values.salary.max}`,
          min: values.salary.min,
          max: values.salary.max,
          period: values.salary.period,
        },
        contact: values.contact,
        createdAt: new Date().toISOString(),
        deadline: values.deadline,
        location: {
          address: values.location.address,
          lat: values.location.lat,
          lng: values.location.lng,
        },
        company: {
          name: values.company.name,
          industry: values.company.industry,
          description: values.company.description,
          employees: values.company.employees,
          website: values.company.website,
        },
      };

      saveJob(job);

      if (isError) {
        console.error("not saved to db");
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const renderStepFields = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter job title"
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
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                      <Combobox
                        options={jobTypes}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select job type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
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
              <FormField
                control={form.control}
                name="workLocation"
                disabled={isFieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location</FormLabel>
                    <FormControl>
                      <Combobox
                        options={workLocations}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select work location"
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
                      placeholder="Enter job description"
                      {...field}
                      disabled={isFieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 1: // Company
        return (
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="company.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company name"
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
                name="company.website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter company website"
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
                name="company.industry"
                disabled={isFieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Industry</FormLabel>
                    <FormControl>
                      <Combobox
                        options={industries}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select company industry"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        disabled={isFieldsDisabled}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company.description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter company description"
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
        );

      case 2: // Requirements
        return (
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="requirements.education"
                disabled={isFieldsDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Education</FormLabel>
                    <FormControl>
                      <Combobox
                        options={educationLevels}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select education level"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements.experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        disabled={isFieldsDisabled}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements.skills"
                disabled={isFieldsDisabled}
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <TagInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Type and press enter to add skills"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3: // Schedule
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  disabled={isFieldsDisabled}
                  control={form.control}
                  name="workSchedule.workdays.from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Day</FormLabel>
                      <FormControl>
                        <Combobox
                          options={weekdays}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select start day"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isFieldsDisabled}
                  control={form.control}
                  name="workSchedule.workdays.to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Day</FormLabel>
                      <FormControl>
                        <Combobox
                          options={weekdays}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select end day"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="workSchedule.workhours.from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
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
                  name="workSchedule.workhours.to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
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
          </div>
        );

      case 4: // Location
        return (
          <div className="space-y-4">
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
                        field.onChange(location);
                      }}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5: // Benefits & Salary
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="salary.min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isFieldsDisabled}
                        value={formatCurrency(field.value.toString())}
                        onChange={(e) => {
                          const value = parseCurrencyString(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary.max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isFieldsDisabled}
                        value={formatCurrency(field.value.toString())}
                        onChange={(e) => {
                          const value = parseCurrencyString(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary.period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isFieldsDisabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isFieldsDisabled}
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Type and press enter to add benefits"
                      suggestions={benefitSuggestions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 6: // Finalize
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isFieldsDisabled}
                        type="email"
                        placeholder="Enter contact email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={
                          field.value
                            ? new Date(field.value + "T00:00:00")
                            : undefined
                        }
                        onChange={(date) => {
                          if (date) {
                            // Ensure we're using local timezone date
                            const localDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            field.onChange(
                              localDate.toISOString().split("T")[0]
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
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Job</CardTitle>
        <CardDescription>
          Create a new job posting with all the necessary details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Basic Info Fields */}
              {renderStepFields(0)}
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Company Details</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Company Fields */}
              {renderStepFields(1)}
            </div>

            {/* Requirements Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Requirements</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Requirements Fields */}
              {renderStepFields(2)}
            </div>

            {/* Schedule Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Work Schedule</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Schedule Fields */}
              {renderStepFields(3)}
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Location</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Location Fields */}
              {renderStepFields(4)}
            </div>

            {/* Benefits & Salary Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Benefits & Salary</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Benefits Fields */}
              {renderStepFields(5)}
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Contact Details</h2>
                <div className="flex-1 ml-4 border-t border-gray-200" />
              </div>
              {/* Contact Fields */}
              {renderStepFields(6)}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isFieldsDisabled}
              >
                {isVerifying ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : null}
                Create Job Posting
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
