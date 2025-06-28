import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import WeatherWidget from './components/WeatherWidget';
import GroupPlanner from './components/GroupPlanner';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import { TravelFormData, DayItinerary, Hotel, ItineraryOption } from './types';
import { LoadScript } from '@react-google-maps/api';
import { getTravelPlan } from './api/gemini';

// Validate image URLs
const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsedUrl = new URL(url);
    return (
      ['http:', 'https:'].includes(parsedUrl.protocol) &&
      /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(parsedUrl.pathname)
    );
  } catch {
    return false;
  }
};

// Utility function for date conversion
const toDateString = (date: Date | null): string | null => {
  return date ? date.toISOString().split('T')[0] : null;
};

const calculateDuration = (startDate: Date | null, endDate: Date | null): number => {
  if (!startDate || !endDate) return 3;
  const diffTime = Math.abs(
    new Date(endDate).getTime() - 
    new Date(startDate).getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (diffDays <= 0) {
    throw new Error('End date must be after start date');
  }
  
  return diffDays;
};

const generatePrompt = (formData: TravelFormData) => {
  const duration = calculateDuration(formData.startDate, formData.endDate);

  return `
Generate 3 distinct travel itinerary options in JSON format ONLY (without any Markdown formatting or additional text) with the following structure:

{
  "options": [
    {
      "title": "Option 1 - Cultural Exploration",
      "description": "Focus on historical sites and cultural experiences",
      "itinerary": [
        {
          "day": 1,
          "places": [
            {
              "name": "Place Name",
              "description": "Detailed description",
              "coordinates": { "lat": 0.0, "lng": 0.0 },
              "ticketPrice": "Price info",
              "bestTime": "Best time to visit",
              "imageUrl": "Valid HTTPS image URL from Unsplash or Wikimedia Commons"
            }
          ]
        }
      ],
      "hotels": [
        {
          "name": "Hotel Name",
          "address": "Full address",
          "price": "Price per night",
          "rating": "Rating out of 5",
          "coordinates": { "lat": 0.0, "lng": 0.0 },
          "imageUrl": "Valid HTTPS image URL"
        }
      ]
    }
  ]
}

Trip Details:
- Destination: ${formData.destination}
- Duration: ${duration} days
- Group type: ${formData.groupType}
- Budget: $${formData.budget}
- Interests: ${formData.interests.join(', ')}
`;
};

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'itinerary'>('form');
  const [travelData, setTravelData] = useState<TravelFormData | null>(null);
  const [itineraryOptions, setItineraryOptions] = useState<ItineraryOption[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const libraries: ('places')[] = ['places'];

  // Validate Google Maps API key on load
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key is missing');
    toast.error('Map functionality will be limited - API key missing');
  }

  const generateItinerary = async (formData: TravelFormData) => {
    setIsLoading(true);
    try {
      // Calculate duration first to validate dates
      calculateDuration(formData.startDate, formData.endDate);
      const prompt = generatePrompt(formData);
      const rawResponse = await getTravelPlan(prompt);

      const aiResponse = typeof rawResponse === 'string'
        ? JSON.parse(rawResponse)
        : rawResponse;

      if (!aiResponse?.options || !Array.isArray(aiResponse.options)) {
        throw new Error('Invalid itinerary format received from API');
      }

      // Additional validation
      aiResponse.options.forEach((option: ItineraryOption) => {
        if (!option.itinerary || !Array.isArray(option.itinerary)) {
          throw new Error('Invalid itinerary structure');
        }
        if (!option.hotels || !Array.isArray(option.hotels)) {
          throw new Error('Invalid hotels structure');
        }
      });

      const validatedOptions: ItineraryOption[] = aiResponse.options.map((option: ItineraryOption) => ({
        ...option,
        itinerary: option.itinerary.map((day: DayItinerary) => ({
          ...day,
          places: day.places.map((place) => ({
            ...place,
            imageUrl: isValidImageUrl(place.imageUrl) ? place.imageUrl : undefined
          }))
        })),
        hotels: option.hotels.map((hotel: Hotel) => ({
          ...hotel,
          imageUrl: isValidImageUrl(hotel.imageUrl) ? hotel.imageUrl : undefined
        }))
      }));

      setTravelData(formData);
      setItineraryOptions(validatedOptions);
      setSelectedOptionIndex(0);
      setCurrentStep('itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (travelData) generateItinerary(travelData);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOptionIndex(index);
  };

  const backToForm = () => setCurrentStep('form');

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div className="text-center py-8">Loading Maps...</div>}
    >
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header />

          <Toaster
            position="top-right"
            toastOptions={{
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
                iconTheme: { primary: '#10B981', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#ffffff' },
              },
            }}
          />

          {currentStep === 'form' ? (
            <>
              <HeroSection />
              <section id="planner" className="py-20 px-4">
                <TravelForm 
                  onGenerateItinerary={generateItinerary} 
                  isLoading={isLoading} 
                />
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
                  aria-label="Back to planning form"
                >
                  ← Back to Planning
                </motion.button>
              </div>

              <div className="space-y-16 px-4">
                {itineraryOptions.length > 0 && (
                  <>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {itineraryOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectOption(index)}
                          className={`px-6 py-3 rounded-lg whitespace-nowrap ${
                            selectedOptionIndex === index
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          aria-label={`Select itinerary option: ${option.title}`}
                        >
                          {option.title}
                        </button>
                      ))}
                    </div>

                    <ItineraryDisplay
                      destination={travelData?.destination || 'Your Destination'}
                      days={itineraryOptions[selectedOptionIndex].itinerary}
                      hotels={itineraryOptions[selectedOptionIndex].hotels}
                      onRegenerate={handleRegenerate}
                    />
                  </>
                )}

                <WeatherWidget
                  destination={travelData?.destination || ''}
                  startDate={toDateString(travelData?.startDate || null)}
                  endDate={toDateString(travelData?.endDate || null)}
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