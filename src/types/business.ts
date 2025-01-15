const industries = [
  "technology",
  "finance",
  "manufacturing",
  "hospitality",
  "healthcare",
  "education",
  "retail",
  "media",
  "construction",
  "transportation",
  "energy",
  "agriculture",
  "entertainment",
] as const;

export type BusinessType = {
  id: string;
  name: string;
  type: "business_center" | "industry" | "event" | "opportunity";
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  category: (typeof industries)[number];
  tags?: string[];
  features?: string[];
  contact: {
    phone: string;
    email?: string;
    website?: string;
    socialMedia?: {
      linkedIn?: string;
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  opportunities?: {
    mentorshipPrograms?: Array<{
      name: string;
      description: string;
      mentorType: string;
      duration?: string;
      eligibility: string;
    }>;
    networkingEvents?: Array<{
      name: string;
      description: string;
      date: string;
      location: string;
      registrationLink?: string;
    }>;
    partnerships?: Array<{
      name: string;
      description: string;
      contactEmail: string;
    }>;
    funding?: Array<{
      name: string;
      amount: string;
      eligibility: string;
      deadline?: string;
    }>;
  };
  photos?: string[];
  rating?: {
    average: number;
    count: number;
  };
  openingHours?: {
    weekday: string;
    weekend?: string;
    holidays?: string;
  };
  news?: Array<{
    headline: string;
    description: string;
    date: string;
    link: string;
  }>;
  createdAt: string;
};
