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
  budget: number; // Changed from string to number
  interests: string[];
}

export interface Activity {
  // Add your activity properties here if needed
}