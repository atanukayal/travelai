// File: src/types.ts

export interface TravelFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  interests: string[];
  budget: number;
  groupType: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  price: string;
  category: string;
  coordinates: [number, number];
}

export interface DayItinerary {
  day: number;
  title: string;
  emoji: string;
  activities: Activity[];
}


