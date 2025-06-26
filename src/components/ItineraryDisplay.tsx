import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Star, Download, Calendar, Share2, 
  Map, List, RefreshCw, MessageCircle, Navigation
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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

interface ItineraryDisplayProps {
  destination: string;
  days: DayItinerary[];
  onRegenerate: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ 
  destination, 
  days, 
  onRegenerate 
}) => {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleExportPDF = () => {
    // Implement PDF export functionality
    console.log('Exporting to PDF...');
  };

  const handleSyncCalendar = () => {
    // Implement calendar sync functionality
    console.log('Syncing to calendar...');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${destination} Trip`,
          text: `Check out my amazing ${destination} itinerary!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className={`text-center mb-8 p-6 rounded-2xl ${
        isDark ? 'bg-slate-800/50' : 'bg-white/50'
      } backdrop-blur-sm`}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Your {destination} Adventure
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {days.length} days of unforgettable experiences
        </motion.p>
      </div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`flex flex-wrap gap-4 justify-center mb-8 p-4 rounded-2xl ${
          isDark ? 'bg-slate-800/50' : 'bg-white/50'
        } backdrop-blur-sm`}
      >
        {/* View Toggle */}
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <List className="h-4 w-4 mr-2 inline" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'map'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Map className="h-4 w-4 mr-2 inline" />
            Map View
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={onRegenerate}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="h-4 w-4 mr-2 inline" />
            Regenerate
          </motion.button>

          <motion.button
            onClick={handleExportPDF}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4 mr-2 inline" />
            Export PDF
          </motion.button>

          <motion.button
            onClick={handleSyncCalendar}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="h-4 w-4 mr-2 inline" />
            Sync Calendar
          </motion.button>

          <motion.button
            onClick={handleShare}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isDark 
                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="h-4 w-4 mr-2 inline" />
            Share
          </motion.button>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-6"
          >
            {days.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden ${
                  isDark ? 'bg-slate-800/80' : 'bg-white/80'
                } backdrop-blur-sm border ${
                  isDark ? 'border-slate-600' : 'border-gray-200'
                } shadow-lg`}
              >
                <div className={`p-6 border-b ${
                  isDark ? 'border-slate-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <span className="text-3xl mr-3">{day.emoji}</span>
                      {day.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Day {day.day}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, activityIndex) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (activityIndex * 0.05) }}
                        className={`p-4 rounded-xl border ${
                          isDark 
                            ? 'bg-slate-700/50 border-slate-600' 
                            : 'bg-gray-50 border-gray-200'
                        } hover:shadow-md transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className={`font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {activity.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'
                              }`}>
                                {activity.category}
                              </span>
                            </div>
                            <p className={`text-sm mb-2 ${
                              isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {activity.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                {activity.rating}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-green-500">$</span>
                                {activity.price}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            className={`p-2 rounded-lg transition-colors ${
                              isDark 
                                ? 'bg-slate-600 hover:bg-slate-500 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Navigation className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`h-96 rounded-2xl overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-gray-200'
            } flex items-center justify-center`}
          >
            <div className="text-center">
              <Map className={`h-16 w-16 mx-auto mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <p className={`text-lg font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Interactive map coming soon!
              </p>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                View all your destinations and activities on an interactive map
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Assistant */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          className={`p-4 rounded-full shadow-lg ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } transition-all duration-300`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ItineraryDisplay;