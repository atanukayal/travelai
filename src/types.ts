// src/types.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  name: string;
  description: string;
  coordinates: Coordinates;
  ticketPrice?: string;
  bestTime?: string;
  imageUrl?: string;
}

export interface Hotel {
  name: string;
  address: string;
  price: string;
  rating: string;
  coordinates: Coordinates;
  imageUrl?: string;
}

export interface DayItinerary {
  day: number;
  places: Place[];
}

// src/types.ts
export interface TravelFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  groupType: string;
  budget: number; // Changed to string to match form input
  interests: string[];
}

export interface Activity {
  // Add activity properties if needed
}

export interface ItineraryOption {
  title: string;
  description: string;
  itinerary: DayItinerary[];
  hotels: Hotel[];
}

// Add this for TravelForm props
export interface TravelFormProps {
  onGenerateItinerary: (data: TravelFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface WeatherDay {
  date: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}