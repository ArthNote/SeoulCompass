"use client";

import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast as sonner } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { updateClerkUser, updateUser } from "@/lib/api/users";
import { CgSpinner } from "react-icons/cg";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "admin"]),
});

const EditUserDialog = ({
  user,
  child,
}: {
  user: UserType;
  child: ReactNode;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.username,
      role: user.role as "user" | "admin",
    },
  });

  const queryClient = useQueryClient();
  const [isVerifying, setVerifying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isFieldsDisabled = React.useMemo(() => isVerifying, [isVerifying]);

  const {
    mutate: updateUserr,
    isError,
    error,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      form.reset();
      setVerifying(false);
      setIsOpen(false);
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    },
    retry: 3,
    onError: (error, variables) => {
      console.error("Error saving user:", error);
      console.error("not saved to db");
      console.error(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
      const updatedUser: UserType = {
        id: user.id,
        username: values.name,
        email: user.email,
        role: values.role as "user" | "admin",
        clerkId: user.clerkId,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      };

      updateUserr(updatedUser);

      if (isError) {
        console.error("not updated");
        console.error(JSON.stringify(error, null, 2));
      }
    } catch (error: any) {
      if (error.status === 422 && error.errors) {
        error.errors.forEach((err: any) => {
          let title = "Error";
          let description = err.message;

          if (err.meta?.paramName === "email_address") {
            title = "Email Already Taken";
          } else if (err.meta?.paramName === "username") {
            title = "Username Already Taken";
          }

          sonner.error(title, {
            description: description,
            action: {
              label: "Cancel",
              onClick: () => {
                sonner.dismiss();
              },
            },
          });
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
      console.error("Error:", JSON.stringify(error, null, 2));
    } finally {
      setVerifying(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{child}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit this User</DialogTitle>
          <DialogDescription>
            Fill in the form below to edit this user.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isFieldsDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-4"
                      disabled={isFieldsDisabled}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <FormLabel htmlFor="user">User</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin" />
                        <FormLabel htmlFor="admin">Admin</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isFieldsDisabled}>
                {isVerifying ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : null}{" "}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
