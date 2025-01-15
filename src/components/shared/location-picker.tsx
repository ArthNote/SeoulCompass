"use client";

import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MapPin, Locate, Maximize2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const libraries = ["places"];

const SEOUL_BOUNDS = {
  north: 37.701,
  south: 37.4283,
  west: 126.7643,
  east: 127.1831,
};

const SEOUL_CENTER = {
  lat: 37.5665,
  lng: 126.978,
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

type LocationPickerProps = {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  defaultValue?: {
    address: string;
    lat: number;
    lng: number;
  };
};

export function LocationPicker({
  onLocationSelect,
  defaultValue,
}: LocationPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,
  });

  // Initialize with default values if provided
  const [selectedLocation, setSelectedLocation] = useState({
    address: defaultValue?.address || "",
    lat: defaultValue?.lat || SEOUL_CENTER.lat,
    lng: defaultValue?.lng || SEOUL_CENTER.lng,
  });

  const [center, setCenter] = useState({
    lat: defaultValue?.lat || SEOUL_CENTER.lat,
    lng: defaultValue?.lng || SEOUL_CENTER.lng,
  });

  const [searchValue, setSearchValue] = useState(defaultValue?.address || "");

  // Update when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const newLocation = {
        address: defaultValue.address || "",
        lat: defaultValue.lat || SEOUL_CENTER.lat,
        lng: defaultValue.lng || SEOUL_CENTER.lng,
      };
      setSelectedLocation(newLocation);
      setCenter({
        lat: newLocation.lat,
        lng: newLocation.lng,
      });
      setSearchValue(newLocation.address);
    }
  }, [defaultValue]);

  const [searchResults, setSearchResults] = useState<
    google.maps.places.PlaceResult[]
  >([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // Set initial position if defaultValue exists
    if (defaultValue && defaultValue.lat && defaultValue.lng) {
      map.panTo({ lat: defaultValue.lat, lng: defaultValue.lng });
    }
  }, [defaultValue]);

  const onPlacesLoad = useCallback(
    (searchBox: google.maps.places.SearchBox) => {
      searchBoxRef.current = searchBox;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const newLocation = {
            address: place.formatted_address || "",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setSelectedLocation(newLocation);
          setSearchValue(newLocation.address); // Update search value
          onLocationSelect(newLocation);
          mapRef.current?.panTo(place.geometry.location);
        }
      }
    }
  }, [onLocationSelect]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
          (results, status) => {
            if (status === "OK" && results?.[0]) {
              const newLocation = {
                address: results[0].formatted_address,
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng(),
              };
              setSelectedLocation(newLocation);
              setSearchValue(newLocation.address); // Update search value
              onLocationSelect(newLocation);
            }
          }
        );
      }
    },
    [onLocationSelect]
  );

  const mapCenter = useMemo(
    () => ({ lat: selectedLocation.lat, lng: selectedLocation.lng }),
    [selectedLocation]
  );

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        address: value,
        bounds: SEOUL_BOUNDS,
      });

      if (response.results) {
        setSearchResults(response.results.slice(0, 5)); // Limit to 5 results
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleSearchResultClick = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const newLocation = {
        address: place.formatted_address || "",
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(newLocation);
      setSearchValue(newLocation.address);
      setSearchResults([]);
      setCenter({
        lat: newLocation.lat,
        lng: newLocation.lng,
      });
      onLocationSelect(newLocation);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new google.maps.Geocoder();

          geocoder.geocode(
            { location: { lat: latitude, lng: position.coords.longitude } },
            (results, status) => {
              if (status === "OK" && results?.[0]) {
                const newLocation = {
                  address: results[0].formatted_address,
                  lat: latitude,
                  lng: longitude,
                };
                setSelectedLocation(newLocation);
                setSearchValue(newLocation.address);
                setCenter({ lat: latitude, lng: position.coords.longitude });
                onLocationSelect(newLocation);
              }
            }
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description:
              "Failed to get your location. Please try searching instead.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleFullScreen = () => {
    if (mapRef.current) {
      google.maps.event.trigger(mapRef.current, "resize");
      const elem = mapRef.current.getDiv() as HTMLElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location in Seoul"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGetCurrentLocation}
            title="Get current location"
          >
            <Locate className="h-4 w-4" />
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md border shadow-lg">
            <div className="py-1">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  onClick={() => handleSearchResultClick(result)}
                >
                  <p className="text-sm font-medium">
                    {result.formatted_address}
                  </p>
                  {result.types && (
                    <p className="text-xs text-muted-foreground">
                      {result.types[0].replace(/_/g, " ")}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative h-[400px] w-full rounded-md border">
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerClassName="w-full h-full rounded-md"
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: false,
            restriction: {
              latLngBounds: SEOUL_BOUNDS,
              strictBounds: true,
            },
            center: center,
            styles: mapStyles,
            minZoom: 11,
            maxZoom: 18,
          }}
          onClick={onMapClick}
          onLoad={onLoad}
        >
          {selectedLocation &&
            selectedLocation.lat !== 0 &&
            selectedLocation.lng !== 0 && (
              <MarkerF
                position={{
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                }}
                animation={google.maps.Animation.DROP}
              />
            )}
        </GoogleMap>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-white shadow-md"
          onClick={handleFullScreen}
          title="Full screen"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      {selectedLocation.address && (
        <p className="text-sm text-muted-foreground mt-2">
          Selected location: {selectedLocation.address}
        </p>
      )}
    </div>
  );
}
