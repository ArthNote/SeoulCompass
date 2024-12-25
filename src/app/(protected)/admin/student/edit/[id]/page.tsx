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
import { use, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { delay } from "@/lib/utils";

const studentCategories = [
  { label: "University", value: "university" },
  { label: "Library", value: "library" },
  { label: "Coaching Center", value: "coaching_center" },
  { label: "School", value: "school" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  category: z.enum(["university", "library", "coaching_center", "school"]),
  location: z.string().min(5, "Location must be at least 5 characters."),
  contact: z
    .string()
    .min(5, "Contact information must be at least 5 characters."),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export default  function page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);

  useEffect(() => {
    if (!id) {
      // If there's no ID, redirect to the tourism list or home page
      redirect("/student");
    }
  }, [id]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      contact: "",
      lat: 0,
      lng: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // TODO: Implement your API call here
      console.log("Updating resource:", id, values);
      redirect("/student");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Resource</CardTitle>
        <CardDescription>
          Update the details of this student resource.
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
                      <Input placeholder="Resource name" {...field} />
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
                        options={studentCategories}
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
                      placeholder="Brief description of the resource"
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

            <div className="grid gap-4 md:grid-cols-2">
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
                onClick={() => redirect("/student")}
              >
                Cancel
              </Button>
              <Button type="submit">Update Resource</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
