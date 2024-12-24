import React from "react";
import { HeaderSection } from "../shared/header_section";
import {
  MapPin,
  BusIcon,
  UniversityIcon,
  Briefcase,
  Building,
  PhoneCall,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

const features: FeatureLdg[] = [
  {
    title: "Comprehensive City Guide",
    description:
      "Explore Seoul's landmarks, hotels, restaurants, and theaters with ease using our user-friendly tourism module.",
    link: "/",
    icon: "mappin",
  },
  {
    title: "Student Assistance",
    description:
      "Discover universities, libraries, and educational institutions to support your academic journey in Seoul.",
    link: "/",
    icon: "uni",
  },
  {
    title: "Job Opportunities",
    description:
      "Access job listings and opportunities across various industries to kickstart your career in Seoul.",
    link: "/",
    icon: "briefcase",
  },
  {
    title: "Business Hub",
    description:
      "Get insights into Seoul's business centers, industries, and opportunities for startups and entrepreneurs.",
    link: "/",
    icon: "building",
  },
];

const Icons = {
  mappin: MapPin,
  bus: BusIcon,
  uni: UniversityIcon,
  briefcase: Briefcase,
  building: Building,
  phone: PhoneCall,
};

const KeyFeatures = () => {
  return (
    <section>
      <div className="pb-6 pt-28">
        <HeaderSection
          label="Features"
          title="Discover our key features."
          subtitle="Discover the tools and features that make navigating Seoul easier and more efficient."
        />

        <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 px-6 sm:px-0">
          {features.map((feature) => {
            const Icon = Icons[feature.icon || "nextjs"];
            return (
              <div
                className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8  mb-3 md:mb-0"
                key={feature.title}
              >
                <div
                  aria-hidden="true"
                  // className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-primary to-primary-foreground opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:opacity-5 dark:group-hover:opacity-10"
                />
                <div className="relative">
                  <div className="relative flex size-12 rounded-2xl border border-border shadow-sm *:relative *:m-auto *:size-6">
                    <Icon className="text-primary" />
                  </div>

                  <p className="mt-6 pb-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
