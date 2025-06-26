import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Sun, CloudRain, CloudSnow, Wind, 
  Thermometer, Droplets, Eye 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

interface WeatherWidgetProps {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  destination, 
  startDate, 
  endDate 
}) => {
  const { isDark } = useTheme();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock weather data - in a real app, this would fetch from a weather API
  useEffect(() => {
    if (destination && startDate) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setWeatherData({
          temperature: 28,
          condition: 'Sunny',
          humidity: 65,
          windSpeed: 12,
          visibility: 10,
          forecast: [
            { day: 'Today', high: 30, low: 22, condition: 'Sunny', icon: '☀️' },
            { day: 'Tomorrow', high: 28, low: 20, condition: 'Partly Cloudy', icon: '⛅' },
            { day: 'Wed', high: 26, low: 18, condition: 'Rainy', icon: '🌧️' },
            { day: 'Thu', high: 29, low: 21, condition: 'Sunny', icon: '☀️' },
            { day: 'Fri', high: 31, low: 23, condition: 'Hot', icon: '🌞' },
          ]
        });
        setLoading(false);
      }, 1000);
    }
  }, [destination, startDate]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snowy':
        return <CloudSnow className="h-8 w-8 text-blue-300" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  if (!destination || !startDate) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-lg border ${
        isDark 
          ? 'bg-slate-800/80 border-slate-600' 
          : 'bg-white/80 border-gray-200'
      } shadow-lg`}
    >
      <div className="text-center mb-6">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Weather in {destination}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {startDate && `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString() || 'End date'}`}
        </motion.p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            className={`w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : weatherData ? (
        <div className="space-y-6">
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-center p-6 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              {getWeatherIcon(weatherData.condition)}
              <span className={`text-4xl font-bold ml-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.temperature}°C
              </span>
            </div>
            <p className={`text-lg font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {weatherData.condition}
            </p>
          </motion.div>

          {/* Weather Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className={`text-center p-4 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <Droplets className={`h-6 w-6 mx-auto mb-2 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Humidity
              </p>
              <p className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.humidity}%
              </p>
            </div>

            <div className={`text-center p-4 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <Wind className={`h-6 w-6 mx-auto mb-2 ${
                isDark ? 'text-green-400' : 'text-green-500'
              }`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Wind Speed
              </p>
              <p className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.windSpeed} km/h
              </p>
            </div>

            <div className={`text-center p-4 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-gray-50'
            }`}>
              <Eye className={`h-6 w-6 mx-auto mb-2 ${
                isDark ? 'text-purple-400' : 'text-purple-500'
              }`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Visibility
              </p>
              <p className={`text-lg font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {weatherData.visibility} km
              </p>
            </div>
          </motion.div>

          {/* 5-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              5-Day Forecast
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {weatherData.forecast.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className={`text-center p-3 rounded-xl ${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-50'
                  } hover:scale-105 transition-transform duration-200`}
                >
                  <p className={`text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {day.day}
                  </p>
                  <div className="text-2xl mb-2">{day.icon}</div>
                  <div className="space-y-1">
                    <p className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.high}°
                    </p>
                    <p className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {day.low}°
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weather Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-4 rounded-xl ${
              isDark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <h4 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-blue-300' : 'text-blue-800'
            }`}>
              💡 Travel Tips
            </h4>
            <ul className={`text-sm space-y-1 ${
              isDark ? 'text-blue-200' : 'text-blue-700'
            }`}>
              <li>• Pack light, breathable clothing for warm weather</li>
              <li>• Don't forget sunscreen and a hat for sunny days</li>
              <li>• Bring a light rain jacket for potential showers</li>
              <li>• Stay hydrated and seek shade during peak hours</li>
            </ul>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Weather information will appear here once you select a destination and dates.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherWidget;