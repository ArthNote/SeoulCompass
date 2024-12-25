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

const categories = [
  { label: "Industry", value: "industry" },
  { label: "Business Center", value: "business_center" },
  { label: "Opportunity", value: "opportunity" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  category: z.enum(["industry", "business_center", "opportunity"]),
  location: z.string().min(5, "Location must be at least 5 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  website: z.string().url("Please enter a valid URL"),
});

export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      website: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement your API call here
      console.log(values);
      router.push("/business");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Business</CardTitle>
        <CardDescription>
          Fill in the form below to create a new business listing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Combobox
                      options={categories}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a category..."
                      searchPlaceholder="Search categories..."
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
                    <Input placeholder="Enter business location" {...field} />
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
                      placeholder="Enter business description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/business")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Business</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
