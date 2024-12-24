import { Button, buttonVariants } from "@/components/ui/button";
import { cn, delay } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import HeroSection from "@/components/homepage/hero_section";
import SeoulImage from "@/components/homepage/seoul_image";
import AboutUs from "@/components/homepage/about_us";
import KeyFeatures from "@/components/homepage/key_features";
import WhyChooseUs from "@/components/homepage/why_choose_us";
import Testimonials from "@/components/homepage/testimonials";

const page = () => {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <HeroSection />
      <SeoulImage />
      <AboutUs />
      <KeyFeatures />
      <WhyChooseUs />
      <Testimonials />
    </section>
  );
};

export default page;
