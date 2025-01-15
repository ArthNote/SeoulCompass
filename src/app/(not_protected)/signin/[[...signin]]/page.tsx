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
import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition, useState } from "react";
import { CardWrapper } from "@/components/auth/card_wrapper";
import { Eye, EyeOff } from "lucide-react";
import { SignedOut, useSignIn } from "@clerk/nextjs";
import { toast } from "@/hooks/use-toast";
import { CgSpinner } from "react-icons/cg";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof SignInSchema>;

export default function Page() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setVerifying] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setVerifying(true);
    const validatedFields = SignInSchema.safeParse(values);

    if (!validatedFields.success) {
      toast({
        title: "Invalid fields",
        description: "Please check the fields and try again.",
        variant: "destructive",
      });
      setVerifying(false);
      return;
    }
    startTransition(async () => {
      if (!isLoaded) return;

      try {
        console.log("creating user");
        const signInAttempt = await signIn.create({
          identifier: values.email,
          password: values.password,
        });

        if (signInAttempt.status === "complete") {
          console.log("setting active");
          await setActive({
            session: signInAttempt.createdSessionId,
          });

          router.push("/user/tourism");
        } else {
          console.error(JSON.stringify("aaaaaaa " + signInAttempt, null, 2));
        }
      } catch (error) {
        console.log("error", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        toast({
          title: "Sign In Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    });
  };

  return (
    <div className="m-16 w-full">
      <CardWrapper
        headerTitle="Sign In"
        backButtonLabel="Don't have an account?"
        backButtonHref="/signup"
        showSocial
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
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
              {isPending ? <CgSpinner className="animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
