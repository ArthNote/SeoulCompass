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

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  company: z.string().min(2, "Company name must be at least 2 characters."),
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
  description: z.string().min(10, "Description must be at least 10 characters."),
  min_salary: z.coerce
    .number()
    .min(0, "Minimum salary must be greater than 0")
    .max(1000000, "Minimum salary must be less than 1,000,000"),
  max_salary: z.coerce
    .number()
    .min(0, "Maximum salary must be greater than 0")
    .max(1000000, "Maximum salary must be less than 1,000,000"),
  contact: z.string().email("Invalid email address"),
  location: z.string().min(5, "Location must be at least 5 characters."),
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
  // Remove currency symbol, commas, and parse as number
  const parsed = value.replace(/[^0-9.-]+/g, "");
  const number = parseFloat(parsed);
  return isNaN(number) ? 0 : number;
};

export default function page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      min_salary: 0,
      max_salary: 0,
      contact: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement your API call here
      console.log(values);
      router.push("/jobs");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Job</CardTitle>
        <CardDescription>
          Fill in the form below to create a new job listing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Combobox
                      options={industries}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select an industry..."
                      searchPlaceholder="Search industries..."
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
                    <Input
                      placeholder="Enter job description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="min_salary"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$0"
                        {...field}
                        value={formatCurrency(value.toString())}
                        onChange={(e) => {
                          const parsed = parseCurrencyString(e.target.value);
                          onChange(parsed);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_salary"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$0"
                        {...field}
                        value={formatCurrency(value.toString())}
                        onChange={(e) => {
                          const parsed = parseCurrencyString(e.target.value);
                          onChange(parsed);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/jobs")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Job</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
