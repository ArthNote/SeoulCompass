"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Briefcase,
  Command,
  CompassIcon,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  MapIcon,
  MapPin,
  PieChart,
  Settings2,
  SquareTerminal,
  University,
  Users,
  LucideIcon,
} from "lucide-react";

import { NavMain } from "@/components/wrappers/sidebar/nav_main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import constants from "../../../../constants";
import { cn } from "@/lib/utils";
import { NavUser } from "./nav_user";

// Define the type for navigation items
type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  type: "admin" | "module";
};

// Type the data object
const data: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  navMain: NavItem[];
} = {
  user: {
    name: "Username",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      type: "admin" as const,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      type: "admin" as const,
    },
    {
      title: "Tourism",
      url: "/tourism",
      icon: MapPin,
      type: "module" as const,
    },
    {
      title: "Student",
      url: "/student",
      icon: University,
      type: "module",
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: Briefcase,
      type: "module",
    },
    {
      title: "Business",
      url: "/business",
      icon: PieChart,
      type: "module",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center gap-2 p-4">
        {state === "collapsed" ? (
          <CompassIcon aria-hidden="true" className="text-primary" />
        ) : (
          <h1 className="text-md font-medium">{constants.name}</h1>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
