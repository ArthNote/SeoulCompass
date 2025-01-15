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
import UserMenu from "./user_menu";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export default function AuthNavBar({ scroll = true }: NavBarProps) {
  const scrolled = useScroll(50);
  const pathname = usePathname();
  const { signOut } = useClerk();

  console.log(pathname);

  const links = [
    {
      title: "Tourism",
      href: "/user/tourism",
    },
    {
      title: "Student Resources",
      href: "/user/student-resources",
    },
    {
      title: "Jobs",
      href: "/user/jobs",
    },
    {
      title: "Business",
      href: "/user/business",
    },
    {
      title: "Favorites",
      href: "/user/favorites",
    },
  ];

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png", // Add your avatar URL here
  };

  return (
    <div
      className={`flex w-full fixed justify-between p-2 border-b z-50  md:px-16 lg:px-24 xl:px-36 2xl:px-64 px-2 bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <div className="flex w-full lg:hidden">
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
                  href="/user/tourism"
                  className="pl-2 flex items-center gap-2"
                  aria-label={constants.name}
                >
                  <CompassIcon aria-hidden="true" className="text-primary" />
                  <h1 className="text-md  font-medium">{constants.name}</h1>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              {links.map((link) => (
                <SheetClose asChild key={link.title}>
                  <Link href={link.href}>
                    <Button
                      variant={
                        pathname.includes(link.href) ? "secondary" : "outline"
                      }
                      className="w-full"
                    >
                      {link.title}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button
                  className="w-full"
                  onClick={() => signOut({ redirectUrl: "signin" })}
                >
                  Sign Out
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        <Link
          href="/user/tourism"
          className="pl-2 flex items-center gap-2"
          aria-label={constants.name}
        >
          <CompassIcon aria-hidden="true" className="text-primary" />
          <h1 className="text-md  font-medium">{constants.name}</h1>
        </Link>
      </div>

      <Link
        href="/user/tourism"
        className="pl-2 hidden items-center gap-2 group lg:flex"
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

      <NavigationMenu className="gap-2 w-full flex justify-between items-center">
        <NavigationMenuList className=" hidden gap-3 justify-between lg:flex ">
          {links.map((link) => (
            <NavigationMenuItem key={link.title}>
              <Link href={link.href} passHref>
                <Button
                  variant={pathname.includes(link.href) ? "secondary" : "ghost"}
                >
                  {link.title}
                </Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 xl:w-[145px] justify-end">
        <UserMenu user={user} />
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
