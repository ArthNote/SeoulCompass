"use client";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { UserProfile } from "../user-profile";
import { ModeToggle } from "@/components/mode_toggle";
import { BlocksIcon, CompassIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use_scroll";
import constants from "../../../../constants";
import { log } from "console";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Marketing Page",
    href: "/marketing-page",
    description: "Write some wavy here to get them to click.",
  },
];

export default function NavBar({ scroll = true }: NavBarProps) {
  //   let userId = null;
  //   /* eslint-disable react-hooks/rules-of-hooks */
  //   if (config?.auth?.enabled) {
  //     const user = useAuth();
  //     userId = user?.userId;
  //   }

  const scrolled = useScroll(50);

  return (
    <div
      className={`flex min-w-full fixed justify-between p-2 border-b z-10 sm:px-24 md:px-32 lg:px-48 xl:px-64 px-2 bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      {/* <div className="flex w-full min-[825px]:hidden">
          <Sheet>
            <SheetTrigger className="p-2 transition">
              <Button
                size="icon"
                variant="ghost"
                className="w-4 h-4"
                aria-label="Open menu"
                asChild
              >
                <GiHamburgerMenu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="pl-2 flex items-center gap-2"
                    aria-label={constants.name}
                  >
                    <CompassIcon aria-hidden="true" className="text-primary" />
                    <h1 className="text-md  font-medium">{constants.name}</h1>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 mt-[1rem]">
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Home
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      About Us
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Features
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Why Choose Us
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Testimonials
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/signin">
                    <Button className="w-full">Sign In</Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            className="pl-2 flex items-center gap-2"
            aria-label={constants.name}
          >
            <CompassIcon aria-hidden="true" className="text-primary" />
            <h1 className="text-md  font-medium">{constants.name}</h1>
          </Link>
        </div> */}
      <Link
        href="/"
        className="pl-2 flex items-center gap-2 min-[825px]:hidden group"
        aria-label={constants.name}
      >
        <CompassIcon
          aria-hidden="true"
          className="text-primary group-hover:-rotate-12 transition-all duration-300"
        />
        <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
          {constants.name}
        </h1>
      </Link>
      <NavigationMenu className="gap-2">
        <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
          <Link
            href="/"
            className="pl-2 flex items-center gap-2 group"
            aria-label={constants.name}
          >
            <CompassIcon
              aria-hidden="true"
              className="text-primary group-hover:-rotate-12 transition-all duration-300"
            />
            <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
              {constants.name}
            </h1>
          </Link>
        </NavigationMenuList>
        <NavigationMenuList>
          {/* <NavigationMenuItem className="max-[825px]:hidden">
              <Link href="/dashboard" legacyBehavior passHref>
                <Button variant="ghost">Home</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="max-[825px]:hidden">
              <Link href="/dashboard" legacyBehavior passHref>
                <Button variant="ghost">About Us</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="max-[825px]:hidden">
              <Link href="/dashboard" legacyBehavior passHref>
                <Button variant="ghost">Features</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="max-[825px]:hidden">
              <Link href="/dashboard" legacyBehavior passHref>
                <Button variant="ghost"> Why Choose Us</Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="max-[825px]:hidden">
              <Link href="/dashboard" legacyBehavior passHref>
                <Button variant="ghost">Testimonials</Button>
              </Link>
            </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2">
        {/* {userId && <UserProfile />} */}
        <ModeToggle />
        <Link href="/signin" legacyBehavior passHref>
          <Button>Sign In</Button>
        </Link>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
