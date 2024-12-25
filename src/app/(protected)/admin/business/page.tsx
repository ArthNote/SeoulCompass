import React from "react";
import { BusinessTable } from "./table/data-table";
import { Business, columns } from "./table/columns";


const page = () => {
  const data: Business[] = [
    {
      id: "b1",
      name: "TechHub Seoul",
      category: "industry",
      location: "Gangnam, Seoul",
      description:
        "A hub for tech startups specializing in AI and IoT solutions.",
      website: "https://techhubseoul.com",
    },
    {
      id: "b2",
      name: "Financial Nexus",
      category: "business_center",
      location: "Jongno-gu, Seoul",
      description:
        "A business center catering to financial companies and investment firms.",
      website: "https://financialnexus.kr",
    },
    {
      id: "b3",
      name: "GreenEnergy Solutions",
      category: "opportunity",
      location: "Mapo-gu, Seoul",
      description: "An initiative promoting renewable energy technologies.",
      website: "https://greenenergysolutions.co.kr",
    },
    {
      id: "b4",
      name: "Fashion District HQ",
      category: "industry",
      location: "Dongdaemun, Seoul",
      description:
        "Leading manufacturers and retailers in fashion and textiles.",
      website: "https://fashiondistricthq.com",
    },
    {
      id: "b5",
      name: "MediaWorks Seoul",
      category: "business_center",
      location: "Seodaemun-gu, Seoul",
      description:
        "A coworking space tailored for media production and design firms.",
      website: "https://mediaworksseoul.com",
    },
    {
      id: "b6",
      name: "Seoul Construction Alliance",
      category: "opportunity",
      location: "Yongsan-gu, Seoul",
      description:
        "A network connecting construction companies with government projects.",
      website: "https://seoulconstruction.kr",
    },
    {
      id: "b7",
      name: "EduTech Innovations",
      category: "industry",
      location: "Songpa-gu, Seoul",
      description:
        "Developers of cutting-edge educational technologies and e-learning tools.",
      website: "https://edutechinnovations.com",
    },
    {
      id: "b8",
      name: "Seoul Biz Tower",
      category: "business_center",
      location: "Yeouido, Seoul",
      description:
        "A high-rise center hosting multinational businesses and startups.",
      website: "https://seoulbiztower.kr",
    },
    {
      id: "b9",
      name: "HealthCare Nexus",
      category: "opportunity",
      location: "Seocho-gu, Seoul",
      description:
        "A health-tech platform connecting innovators and healthcare providers.",
      website: "https://healthcarenexus.kr",
    },
    {
      id: "b10",
      name: "Retail Park",
      category: "industry",
      location: "Jamsil, Seoul",
      description:
        "A retail hotspot featuring flagship stores of leading brands.",
      website: "https://retailpark.kr",
    },
    {
      id: "b11",
      name: "StartUp Hive",
      category: "business_center",
      location: "Gangbuk-gu, Seoul",
      description: "A collaborative coworking space for budding entrepreneurs.",
      website: "https://startuphive.kr",
    },
    {
      id: "b12",
      name: "Innovation Hub Korea",
      category: "opportunity",
      location: "Guro-gu, Seoul",
      description: "A platform for innovation challenges and hackathons.",
      website: "https://innovationhub.kr",
    },
    {
      id: "b13",
      name: "TechGrowth Labs",
      category: "industry",
      location: "Eunpyeong-gu, Seoul",
      description:
        "Specialists in growing tech-based small and medium businesses.",
      website: "https://techgrowthlabs.com",
    },
    {
      id: "b14",
      name: "Central Biz Plaza",
      category: "business_center",
      location: "Nowon-gu, Seoul",
      description: "An office complex for mid-sized companies and agencies.",
      website: "https://centralbizplaza.kr",
    },
    {
      id: "b15",
      name: "Hospitality Ventures",
      category: "opportunity",
      location: "Gwangjin-gu, Seoul",
      description: "Investments and development opportunities in hospitality.",
      website: "https://hospitalityventures.kr",
    },
    {
      id: "b16",
      name: "Seoul Digital Works",
      category: "industry",
      location: "Jung-gu, Seoul",
      description:
        "Leading providers of digital marketing and branding solutions.",
      website: "https://seouldigitalworks.kr",
    },
    {
      id: "b17",
      name: "Creative Hub Seoul",
      category: "business_center",
      location: "Dongjak-gu, Seoul",
      description:
        "A shared space for creative and design-focused enterprises.",
      website: "https://creativehub.kr",
    },
    {
      id: "b18",
      name: "Transportation Future Seoul",
      category: "opportunity",
      location: "Gangdong-gu, Seoul",
      description: "Focus on smart and sustainable transportation projects.",
      website: "https://transportationfuture.kr",
    },
    {
      id: "b19",
      name: "Seoul Fashion Circle",
      category: "industry",
      location: "Gangnam, Seoul",
      description: "A collaborative group of Seoul’s top fashion designers.",
      website: "https://seoulfashioncircle.com",
    },
    {
      id: "b20",
      name: "SmartCity Hub",
      category: "business_center",
      location: "Mapo-gu, Seoul",
      description:
        "A business hub for companies focused on smart city solutions.",
      website: "https://smartcityhub.kr",
    },
  ];

  return <BusinessTable columns={columns} data={data} />;
};

export default page;
