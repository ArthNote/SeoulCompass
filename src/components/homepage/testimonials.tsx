import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import Image from "next/image";
import { HeaderSection } from "../shared/header_section";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Living in Seoul has been a life-changing experience. The innovative solutions and smart services offered by the city have made everyday life incredibly convenient and sustainable.",
      name: "Emily Carter",
      title: "Urban Explorer",
      occupation: "Travel Blogger",
    },
    {
      quote:
        "As a student in Seoul, I’ve been able to access cutting-edge technology and incredible resources for my studies. The city truly feels like the future of education.",
      name: "Jin Park",
      title: "Graduate Student",
      occupation: "Computer Science Major",
    },
    {
      quote:
        "The business ecosystem in Seoul is unparalleled. The tools and opportunities available have helped my startup grow and reach new markets.",
      name: "Li Wei",
      title: "Entrepreneur",
      occupation: "Startup Founder",
    },
    {
      quote:
        "Exploring Seoul as a tourist has been a delight. The smart city features make navigating and discovering the culture so effortless.",
      name: "Sophia Martinez",
      title: "Traveler",
      occupation: "Photographer",
    },
    {
      quote:
        "Seoul’s focus on sustainability and innovation inspires me every day. The city’s vision for a greener future is something every city should emulate.",
      name: "Arun Patel",
      title: "Environmentalist",
      occupation: "Researcher",
    },
    {
      quote:
        "Seoul is a city where technology and culture harmonize perfectly. It's amazing how everything is optimized for efficiency without losing its soul.",
      name: "Amara Okafor",
      title: "Digital Nomad",
      occupation: "UX Designer",
    },
    {
      quote:
        "As a parent, I feel safe and supported here. Seoul's smart systems ensure my family always has access to healthcare, education, and entertainment seamlessly.",
      name: "Mark Johnson",
      title: "Family Man",
      occupation: "Teacher",
    },
    {
      quote:
        "The integration of smart technology into Seoul's infrastructure has made commuting a breeze. Public transport is fast, reliable, and eco-friendly.",
      name: "Hiro Tanaka",
      title: "Daily Commuter",
      occupation: "Financial Analyst",
    },
    {
      quote:
        "Seoul's job market is thriving, thanks to its smart city initiatives. I was able to find a position that perfectly matches my skills within weeks.",
      name: "Sara Ahmed",
      title: "New Resident",
      occupation: "Software Developer",
    },
    {
      quote:
        "Seoul isn’t just a city—it’s an experience. From smart homes to interactive public spaces, everything here is designed to improve the quality of life.",
      name: "Carlos Rivera",
      title: "Admirer",
      occupation: "Architect",
    },
  ];
  return (
    <section>
      <div className="container flex flex-col gap-10 pb-28 sm:gap-y-16 px-6 sm:px-0 mx-0">
        <HeaderSection
          label="Testimonials"
          title="What our users are sharing."
          subtitle="Discover the glowing feedback from our delighted users
            worldwide."
        />

        <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
          {testimonials.map((item) => (
            <div className="break-inside-avoid " key={item.name}>
              <div className="relative rounded-xl border bg-card">
                <div className="flex flex-col px-4 py-5 sm:p-6">
                  <div>
                    <div className="relative mb-4 flex items-center gap-3">
                      <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                        <Image
                          width={100}
                          height={100}
                          className="size-full rounded-full border"
                          src="/systemAvatar.png"
                          alt={item.name}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.occupation}
                        </p>
                      </div>
                    </div>
                    <q className="text-muted-foreground">
                      {item.quote}
                    </q>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
