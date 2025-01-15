"use client";

import React, { useState } from "react";
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
import { Plus, Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClerkUser, createUser, deleteClerkUser } from "@/lib/api/users";
import { toast } from "@/hooks/use-toast";
import { toast as sonner } from "sonner";
import { useSignUp } from "@clerk/nextjs";
import { UserType } from "@/types/user";
import { CgSpinner } from "react-icons/cg";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

const CreateUserDialog = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const [isVerifying, setVerifying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Move form initialization outside of render
  const defaultValues = {
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Create a memoized disabled value
  const isFieldsDisabled = React.useMemo(() => isVerifying, [isVerifying]);

  const {
    mutate: saveUser,
    isError,
    error,
  } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User saved successfully:", data);
      form.reset();
      setShowPassword(false);
      setVerifying(false);
      setIsOpen(false);
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    },
    retry: 3,
    onError: (error, variables) => {
      console.error("Error saving user:", error);
      console.error("not saved to db");
      console.error(JSON.stringify(error, null, 2));
      deleteClerkUser(variables.clerkId || "");
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
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
      console.log("creating user");
      const clerkId = await createClerkUser(
        values.email,
        values.name,
        values.password
      );
      if (clerkId !== "" && clerkId !== undefined) {
        console.log("setting active");
        console.log("clerkId ", clerkId);
        const user: UserType = {
          id: "",
          username: values.name,
          email: values.email,
          role: values.role as "user" | "admin",
          clerkId: clerkId,
          imageUrl: "https://github.com/shadcn.png",
          createdAt: new Date().toISOString(),
        };

        saveUser(user);

        if (isError) {
          console.error("not saved to db");
          console.error(JSON.stringify(error, null, 2));
          deleteClerkUser(clerkId);
        }

        console.log("saved to db");
      } else {
        console.error("Error creating user");
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-auto h-8">
          <Plus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a User</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new user.
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
                    <Input
                      placeholder="Pedro Duarte"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="pedro@gmail.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={isFieldsDisabled}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isFieldsDisabled}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
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
                ) : null}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
