"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { useSignUp, useUser } from "@clerk/nextjs";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import MoonLoader from "react-spinners/MoonLoader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "@/components/auth/card_wrapper";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { CgSpinnerAlt, CgSpinner } from "react-icons/cg";
import { useMutation } from "@tanstack/react-query";
import { UserType } from "@/types/user";
import { OAuthStrategy } from "@clerk/types";
import constants from "../../../../../constants";
import { delay } from "@/lib/utils";
import { toast } from "sonner";
import { createUser, deleteClerkUser } from "@/lib/api/users";

const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type SignUpFormValues = z.infer<typeof SignUpSchema>;

export default function Page() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setVerifying] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signUp, setActive, isLoaded } = useSignUp();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const {
    mutate: saveUser,
    isError,
    error,
  } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User saved successfully:", data);
      router.push("/user/tourism");
    },
    retry: 3,
    onError: (error, variables) => {
      console.error("Error saving user:", error);
      console.error("not saved to db");
      console.error(JSON.stringify(error, null, 2));
      deleteClerkUser(variables.clerkId || "");
      toast.error("Error", {
        description: "Failed to create user. Please try again.",
      });
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setVerifying(true);
    const validatedFields = SignUpSchema.safeParse(values);

    if (!validatedFields.success) {
      toast("Invalid fields", {
        description: "Please check the fields and try again.",
      });
      setVerifying(false);
      return;
    }
    startTransition(async () => {
      if (!isLoaded) return;

      try {
        console.log("creating user");
        const signUpAttempt = await signUp.create({
          emailAddress: values.email,
          password: values.password,
          username: values.name,
        });

        if (signUpAttempt.status === "complete") {
          console.log("setting active");

          const user: UserType = {
            id: "",
            username: values.name,
            email: values.email,
            role: "user",
            clerkId: signUpAttempt.createdUserId || "null",
            imageUrl: "https://github.com/shadcn.png",
            createdAt: new Date().toISOString(),
          };

          saveUser(user);

          if (isError) {
            console.error("not saved to db");
            console.error(JSON.stringify(error, null, 2));
            deleteClerkUser(signUpAttempt.createdUserId || "");
          }

          console.log("saved to db");

          await setActive({
            session: signUpAttempt.createdSessionId,
          });
        } else {
          console.error("aaaaaa " + JSON.stringify(signUpAttempt, null, 2));
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

            toast.error(title, {
              description: description,
              action: {
                label: "Cancel",
                onClick: () => {
                  toast.dismiss();
                },
              },
            });
          });
        } else {
          toast("Error", {
            description: "An unexpected error occurred. Please try again.",
          });
        }
        console.error("Error:", JSON.stringify(error, null, 2));
      } finally {
        setVerifying(false);
      }
    });
  };

  return (
    <div className="m-16 w-full">
      <CardWrapper
        headerTitle="Sign Up"
        backButtonLabel="Already have an account?"
        backButtonHref="/signin"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Tyler Durden"
                        disabled={isPending}
                        type="name"
                        className="bg-background/50 dark:bg-background/30 ring-foreground/5"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                        {...field}
                        placeholder="tylerdurden@gmail.com"
                        disabled={isPending}
                        type="email"
                        className="bg-background/50 dark:bg-background/30 ring-foreground/5"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
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
                          {...field}
                          placeholder="••••••••"
                          disabled={isPending}
                          type={showPassword ? "text" : "password"}
                          className="bg-background/50 dark:bg-background/30 ring-foreground/5 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 " />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" disabled={isPending} type="submit">
              {isVerifying ? <CgSpinner className="animate-spin" /> : null} Sign
              Up
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
