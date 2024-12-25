"use client";

import React, { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/shared/combobox";
import { Location } from "@/app/(protected)/(admin)/tourism/table/columns";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const EditLocationDialog = ({
  location,
  child,
}: {
  location: Location;
  child: ReactNode;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location.name,
      description: location.description,
      category: location.category,
      location: location.location,
      contact: location.contact,
      rating: location.rating,
      lat: location.lat,
      lng: location.lng,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement your API call here
      console.log(values);
      // Close dialog or show success message
    } catch (error) {
      console.error(error);
      // Show error message
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{child}</DialogTrigger>
      <DialogContent className="h-fit sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Make changes to the location details below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]" type="hover">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2 flex flex-col ">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationDialog;
