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
import { redirect, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Business } from "../../table/columns";

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

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  useEffect(() => {
    if (!id) {
      // If there's no ID, redirect to the tourism list or home page
      redirect("/business");
    }
  }, [id]);


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
      redirect("/business");
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Business</CardTitle>
        <CardDescription>
          Update the business information below.
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
                onClick={() => redirect("/business")}
              >
                Cancel
              </Button>
              <Button type="submit">Update Business</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
