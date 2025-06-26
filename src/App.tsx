import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import WeatherWidget from './components/WeatherWidget';
import GroupPlanner from './components/GroupPlanner';

interface TravelFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  interests: string[];
  budget: number;
  groupType: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: number;
  price: string;
  category: string;
  coordinates: [number, number];
}

interface DayItinerary {
  day: number;
  title: string;
  emoji: string;
  activities: Activity[];
}

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'itinerary'>('form');
  const [travelData, setTravelData] = useState<TravelFormData | null>(null);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);

  // Mock AI itinerary generation
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

  const backToForm = () => {
    setCurrentStep('form');
  };

  return (
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
          }}
        />
        
        {currentStep === 'form' ? (
          <>
            <HeroSection />
            
            <section id="planner" className="py-20 px-4">
              <TravelForm onGenerateItinerary={generateItinerary} />
            </section>

            <section id="features" className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Why Choose Planiva?
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Our AI-powered platform creates personalized travel experiences tailored to your unique preferences
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: '🤖',
                      title: 'AI-Powered Planning',
                      description: 'Advanced algorithms create personalized itineraries based on your preferences'
                    },
                    {
                      icon: '🗺️',
                      title: 'Interactive Maps',
                      description: 'Explore destinations with detailed maps and location-based recommendations'
                    },
                    {
                      icon: '🌤️',
                      title: 'Weather Integration',
                      description: 'Real-time weather forecasts help you pack and plan activities accordingly'
                    },
                    {
                      icon: '👥',
                      title: 'Group Collaboration',
                      description: 'Plan together with friends and family using shared itineraries and chat'
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-600"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
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

        <footer className="bg-gray-900 dark:bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">Ready for Your Next Adventure?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers who trust Planiva to create unforgettable experiences. 
                Start planning your perfect trip today!
              </p>
              <motion.button
                onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Planning Now
              </motion.button>
            </motion.div>
            
            <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm">
              <p>&copy; 2025 Planiva. All rights reserved. Made with ❤️ for travelers.</p>
            </div>
          </div>
        </footer>

        <style jsx global>{`
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
        `}</style>
      </div>
    </ThemeProvider>
  );
}

export default App;