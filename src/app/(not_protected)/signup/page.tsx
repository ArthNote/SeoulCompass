"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useTransition } from "react";

export default function Page() {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });


  return (
    <div className="m-16 w-full">
      <CardWrapper
        headerTitle="Sign Up"
        backButtonLabel="Already have an account?"
        backButtonHref="/signin"
        showSocial
      >
        <Form {...form}>
          <form className="space-y-1 w-full">
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
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type="password"
                        className="bg-background/50 dark:bg-background/30 ring-foreground/5"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 " />
                  </FormItem>
                )}
              />
              <div></div>
            </div>
            <Button className="w-full" disabled={isPending} type="submit">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
