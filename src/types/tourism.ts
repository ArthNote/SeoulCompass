const types = [
  "amusement_park",
  "aquarium",
  "art_gallery",
  "museum",
  "park",
  "tourist_attraction",
  "zoo",
  "embassy",
  "fire_station",
  "police",
  "gym",
  "pharmacy",
  "hospital",
  "train_station",
  "subway_station",
  "bus_station",
  "taxi_stand",
  "parking",
  "restaurant",
  "cafe",
  "supermarket",
  "bank",
  "atm",
  "shopping_mall",
  "lodging",
] as const;

export type TourismType = {
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
  accessibility: string[];
  facilities?: string[];
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
  createdAt: string; // Should be in ISO format
  landmarks: Array<{
    name: string;
    distance: number;
    type: (typeof types)[number];
  }>;
};

export interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  photos: string[];
  accessibility: string[];
  rating: number;
  userRatingCount: number;
  createdAt: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  openingHours: {
    weekday: string;
    weekend: string;
  };
  landmarks: Landmark[];
  facilities?: string[];
}

export interface Landmark {
  name: string;
  distance: number;
  type: string;
}

export interface TourismPageParams {
  page: number;
  size: number;
  name?: string;
  types?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// When creating a new tourism item, format the date like this:
const tourism = {
  // ...other fields...
  createdAt: new Date().toISOString(),
  // ...other fields...
};

// export type TourismType = {
//   id: string;
//   displayName: string;
//   location: {
//     address: string;
//     latitude: number;
//     longitude: number;
//   };
//   rating: number;
//   websiteUri?: string;
//   phoneNumber?: string;
//   email?: string;
//   userRatingCount: number;
//   shortFormattedAddress: string;
//   editorialSummary?: {
//     text: string;
//     languageCode: string;
//   };
//   photos?: Array<{
//     name: string;
//     widthPx: number;
//     heightPx: number;
//     googleMapsUri: string;
//   }>;
//   currentOpeningHours?: {
//     openNow: boolean;
//     weekdayDescriptions: string[];
//   };
//   reviews?: Array<{
//     rating: number;
//     text: {
//       text: string;
//       languageCode: string;
//     };
//     authorAttribution: {
//       displayName: string;
//       photoUri: string;
//     };
//     publishTime: string;
//   }>;

//   addressDescriptor?: {
//     landmarks: Array<{
//       name: string;
//       placeId: string;
//       displayName: {
//         text: string;
//         languageCode: string;
//       };
//       types: string[];
//       straightLineDistanceMeters?: number;
//       spatialRelationship?: string;
//     }>;
//   };
// }
