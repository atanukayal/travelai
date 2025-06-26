// File: src/App.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import WeatherWidget from './components/WeatherWidget';
import GroupPlanner from './components/GroupPlanner';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import { TravelFormData, Activity, DayItinerary } from './types';

import { LoadScript } from '@react-google-maps/api';


function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'itinerary'>('form');
  const [travelData, setTravelData] = useState<TravelFormData | null>(null);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const libraries: ("places")[] = ["places"];

  const generateItinerary = (formData: TravelFormData) => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        name: 'Beach Walk & Sunrise',
        description: 'Start your day with a peaceful walk along the pristine coastline',
        duration: '2 hours',
        rating: 4.8,
        price: 'Free',
        category: 'Nature',
        coordinates: [15.2993, 74.1240]
      },
      {
        id: '2',
        name: 'Local Market Tour',
        description: 'Explore vibrant local markets and taste authentic street food',
        duration: '3 hours',
        rating: 4.6,
        price: '$25',
        category: 'Culture',
        coordinates: [15.2993, 74.1240]
      },
      {
        id: '3',
        name: 'Historical Fort Visit',
        description: 'Discover the rich history and stunning architecture',
        duration: '4 hours',
        rating: 4.7,
        price: '$15',
        category: 'History',
        coordinates: [15.2993, 74.1240]
      },
      {
        id: '4',
        name: 'Sunset Beach Dinner',
        description: 'Enjoy fresh seafood while watching a beautiful sunset',
        duration: '2 hours',
        rating: 4.9,
        price: '$45',
        category: 'Dining',
        coordinates: [15.2993, 74.1240]
      }
    ];

    const mockItinerary: DayItinerary[] = [
      {
        day: 1,
        title: 'Arrival & Beach Exploration',
        emoji: '🏖️',
        activities: [mockActivities[0], mockActivities[1]]
      },
      {
        day: 2,
        title: 'Cultural Discovery',
        emoji: '🏛️',
        activities: [mockActivities[2], mockActivities[3]]
      },
      {
        day: 3,
        title: 'Adventure & Relaxation',
        emoji: '🌅',
        activities: [mockActivities[0], mockActivities[3]]
      }
    ];

    setTravelData(formData);
    setItinerary(mockItinerary);
    setCurrentStep('itinerary');
  };

  const handleRegenerate = () => {
    if (travelData) {
      generateItinerary(travelData);
    }
  };

  const backToForm = () => setCurrentStep('form');

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
  // Replace with your actual key
      libraries ={['places']}
    >
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />

        <Toaster position="top-right" toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }} />

        {currentStep === 'form' ? (
          <>
            <HeroSection />
            <section id="planner" className="py-20 px-4">
              <TravelForm onGenerateItinerary={generateItinerary} />
            </section>
            <FeaturesSection />
          </>
        ) : (
          <div className="pt-20 pb-16">
            <div className="mb-8 px-4">
              <motion.button
                onClick={backToForm}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                ← Back to Planning
              </motion.button>
            </div>
            <div className="space-y-16 px-4">
              <ItineraryDisplay
                destination={travelData?.destination || 'Your Destination'}
                days={itinerary}
                onRegenerate={handleRegenerate}
              />
              <WeatherWidget
                destination={travelData?.destination || ''}
                startDate={travelData?.startDate || null}
                endDate={travelData?.endDate || null}
              />
              <GroupPlanner
                tripId="sample-trip-123"
                destination={travelData?.destination || 'Your Destination'}
              />
            </div>
          </div>
        )}

        <Footer />

        <style>
          {`
            :root {
              --toast-bg: #ffffff;
              --toast-color: #374151;
              --toast-border: #e5e7eb;
            }
            .dark {
              --toast-bg: #374151;
              --toast-color: #ffffff;
              --toast-border: #4b5563;
            }
          `}
        </style>
      </div>
    </ThemeProvider>
    </LoadScript>
    
  );
}

export default App;
