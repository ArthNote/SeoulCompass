const types = [
  "university",
  "library",
  "secondary_school",
  "primary_school",
  "book_store",
] as const;

export type StudentResource = {
  id: string;
  name: string;
  type: (typeof types)[number];
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  photos?: string[];
  facilities?: string[];
  tags?: string[];
  resources?: string[];
  accessibility: string[];
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  rating: number;
  userRatingCount: number;
  openingHours: {
    weekday: string;
    weekend: string;
  };
  createdAt: string;
};
