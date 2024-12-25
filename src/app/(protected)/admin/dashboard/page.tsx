import { AppSidebar } from "@/components/wrappers/sidebar/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import HeroSection from "@/components/homepage/hero_section";
import InfoCard from "@/components/admin/info_card";
import {
  Briefcase,
  Building,
  LucideIcon,
  MapPin,
  University,
  Users,
} from "lucide-react";
import LatestAddedData from "@/components/admin/latest_added_data";
import { UsersChart } from "@/components/admin/users_chart";
import { ModulesVisitorsChart } from "@/components/admin/modules_visitors_chart";
import { delay } from "@/lib/utils";

export default function Page() {
  type LatestAddedDataProps = {
    title: string;
    description: string;
    viewAllUrl: string;
    data: {
      name: string;
      email: string;
      date: string;
      pic: string;
    }[];
    headers: string[];
  };

  type InfoCardProp = {
    title: string;
    data: number;
    icon: LucideIcon;
    description: string;
  };

  const data: InfoCardProp[] = [
    {
      title: "Users",
      data: 3245,
      icon: Users,
      description: "Total number of registered users in the system.",
    },
    {
      title: "Locations",
      data: 3245,
      icon: MapPin,
      description: "Count of available tourist and city locations.",
    },
    {
      title: "Student Resources",
      data: 3245,
      icon: University,
      description: "Number of educational resources available to students",
    },
    {
      title: "Jobs",
      data: 3245,
      icon: Briefcase,
      description: "Total job opportunities listed in the city.",
    },
    {
      title: "Businesses",
      data: 3245,
      icon: Building,
      description: "Number of businesses registered in the city directory",
    },
  ];

  const latestUsers: LatestAddedDataProps = {
    title: "Latest Users",
    description: "List of the latest users registered in the system.",
    viewAllUrl: "/users",
    data: [
      {
        name: "John Doe",
        email: "john@gmail.com",
        date: "5 min ago",
        pic: "https://github.com/shadcn.png",
      },
      {
        name: "Jane Smith",
        email: "jane.smith@gmail.com",
        date: "10 min ago",
        pic: "https://github.com/shadcn.png",
      },
      {
        name: "Michael Johnson",
        email: "michael.johnson@gmail.com",
        date: "20 min ago",
        pic: "https://github.com/shadcn.png",
      },
      {
        name: "Emily Davis",
        email: "emily.davis@gmail.com",
        date: "1 hour ago",
        pic: "https://github.com/shadcn.png",
      },
      {
        name: "William Brown",
        email: "william.brown@gmail.com",
        date: "2 hours ago",
        pic: "https://github.com/shadcn.png",
      },
    ],
    headers: ["User", "Date"],
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.map((card, index) => (
          <InfoCard
            key={index}
            title={card.title}
            data={card.data}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>{" "}
      <UsersChart />
      <div className="w-full flex flex-col gap-5 h-fit lg:flex-row">
        <div className="w-full lg:w-1/2">
          <LatestAddedData latestData={latestUsers} />
        </div>
        <div className="w-full lg:w-1/2">
          <ModulesVisitorsChart />
        </div>
      </div>
    </div>
  );
}
