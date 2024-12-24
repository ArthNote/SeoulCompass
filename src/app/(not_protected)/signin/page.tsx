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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card_wrapper";

export default function Page() {
  const searchParams = useSearchParams();
   const urlError =
     searchParams.get("error") === "OAuthAccountNotLinked"
       ? "Email already in use with different provider!"
       : "";

   const [isPending, startTransition] = useTransition();

   const form = useForm({
     defaultValues: {
       email: "",
       password: "",
     },
   });
  
  return (
    <div className="m-16 w-full">
      <CardWrapper
        headerTitle="Sign In"
        backButtonLabel="Don't have an account?"
        backButtonHref="/signup"
        showSocial
      >
        <Form {...form}>
          <form className="space-y-1">
            <div className="space-y-2">
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
                    <FormMessage className="text-red-500" />
                    <Button
                      size="sm"
                      variant="link"
                      className="px-0 text-blue-500"
                    >
                      <Link href="/reset">Forgot Password?</Link>
                    </Button>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" disabled={isPending} type="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
