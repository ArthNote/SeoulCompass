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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const locationCategories = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Hotel", value: "hotel" },
  { label: "Attraction", value: "attraction" },
  { label: "Bank", value: "bank" },
  { label: "Theater", value: "theater" },
  { label: "Bus Station", value: "bus_station" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  category: z.enum([
    "restaurant",
    "hotel",
    "attraction",
    "bank",
    "theater",
    "bus_station",
  ]),
  location: z.string().min(5, "Location must be at least 5 characters."),
  contact: z.string(),
  rating: z.number().min(0).max(5),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
import React, { use, useEffect } from "react";
import exp from "constants";
import { redirect } from "next/navigation";
import { delay } from "@/lib/utils";

type Location = {
  id: string;
  name: string;
  description: string;
  category:
    | "restaurant"
    | "hotel"
    | "attraction"
    | "bank"
    | "theater"
    | "bus_station";
  location: string;
  contact: string;
  rating: number;
  lat: number;
  lng: number;
};

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  useEffect(() => {
    if (!id) {
      // If there's no ID, redirect to the tourism list or home page
      redirect("/tourism");
    }
  }, [id]);

  //   const location: Location = {
  //     id: params.get("id") as string,
  //     name: params.get("name") as string,
  //     description: params.get("description") as string,
  //     category: params.get("category") as
  //       | "restaurant"
  //       | "hotel"
  //       | "attraction"
  //       | "bank"
  //       | "theater"
  //       | "bus_station",
  //     location: params.get("location") as string,
  //     contact: params.get("contact") as string,
  //     rating: parseFloat(params.get("rating") as string),
  //     lat: parseFloat(params.get("lat") as string),
  //     lng: parseFloat(params.get("lng") as string),
  //   };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: id,
      description: "",
      location: "",
      contact: "",
      rating: 0,
      lat: 0,
      lng: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement your API call here
      console.log(values);
      redirect("/tourism");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Details</CardTitle>
        <CardDescription>
          Fill in the form below to update this location.
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Combobox
                        options={locationCategories}
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the location"
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Physical address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Contact information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        min={-90}
                        max={90}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        min={-180}
                        max={180}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
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
                onClick={() => redirect("/tourism")}
              >
                Cancel
              </Button>
              <Button type="submit">Update Location</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default page;
