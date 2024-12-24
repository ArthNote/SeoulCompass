import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { ArrowRight, CompassIcon } from "lucide-react";
import constants from "../../../constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
      <Link
        href=""
        className={cn(
          buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
          "px-4"
        )}
      >
        <span className="mr-3">🎉</span>
        <span>{constants.name} is Online </span>
        <span className="ml-3">🎉</span>
      </Link>

      <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
        Explore and Navigate Seoul{" "}
        <span className="text-primary">with Ease</span>
      </h1>

      <p
        className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
        style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
      >
        Discover the best spots in Seoul with ease. From navigation and local
        recommendations to tailored tools.
      </p>

      <div className="flex justify-center items-center gap-3">
        <Link href="/signin" className="mt-5">
          <Button className="animate-buttonheartbeat rounded-md text-sm font-semibold w-40">
            Get Started
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </Link>

        {/* <Link
            href="https://discord.gg/HUcHdrrDgY"
            target="_blank"
            className="mt-5"
            aria-label="Join Discord (opens in a new tab)"
          >
            <Button variant="outline" className="flex gap-1">
              Join Discord
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link
            href="https://github.com/michaelshimeles/nextjs14-starter-template"
            target="_blank"
            className="animate-buttonheartbeat border p-2 rounded-full mt-5 hover:dark:bg-black hover:cursor-pointer"
            aria-label="View NextJS 14 Starter Template on GitHub"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
          </Link> */}
      </div>
    </div>
  );
};

export default HeroSection;
