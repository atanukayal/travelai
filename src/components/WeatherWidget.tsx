import { useEffect, useState } from 'react';
import { WeatherDay } from '../types';

interface WeatherWidgetProps {
  destination: string;
  startDate: string | null;
  endDate: string | null;
}

const weatherIcons: Record<string, string> = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const MAX_FORECAST_DAYS = 5; // OpenWeatherMap free tier limit

const WeatherWidget = ({ destination, startDate, endDate }: WeatherWidgetProps) => {
  const [weatherData, setWeatherData] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitNotice, setShowLimitNotice] = useState(false);

  useEffect(() => {
    if (!destination || !startDate || !endDate) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setShowLimitNotice(false);
      
      try {
        // Geocode destination to get coordinates
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        
        if (!geoResponse.ok) throw new Error('Failed to fetch location data');
        
        const geoData = await geoResponse.json();
        if (!geoData?.length) throw new Error('Location not found');
        
        const { lat, lon } = geoData[0];
        
        // Calculate requested days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const requestedDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (requestedDays > MAX_FORECAST_DAYS) {
          setShowLimitNotice(true);
        }

        // Get weather forecast
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
        
        const weatherData = await weatherResponse.json();
        
        // Process to get daily forecasts
        const dailyForecasts: Record<string, WeatherDay> = {};
        
        weatherData.list.forEach((forecast: any) => {
          const date = forecast.dt_txt.split(' ')[0];
          if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
              date,
              condition: forecast.weather[0].main,
              temperature: Math.round(forecast.main.temp),
              humidity: forecast.main.humidity,
              windSpeed: Math.round(forecast.wind.speed),
              icon: forecast.weather[0].icon,
            };
          }
        });
        
        // Convert to array and limit to MAX_FORECAST_DAYS
        const result = Object.values(dailyForecasts)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, MAX_FORECAST_DAYS);
        
        setWeatherData(result);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [destination, startDate, endDate]);

  if (!destination || !startDate || !endDate) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Weather Forecast for {destination}
      </h2>
      
      {loading && <p className="text-gray-600 dark:text-gray-300">Loading weather data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {showLimitNotice && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg">
          <p>Note: Free weather API provides forecasts for {MAX_FORECAST_DAYS} days only.</p>
        </div>
      )}
      
      {weatherData.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weatherData.map((day, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <div className="flex justify-center mb-2">
                  <div className="text-3xl">
                    {weatherIcons[day.icon] || '☀️'}
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {day.temperature}°F
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {day.condition.toLowerCase()}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Humidity: {day.humidity}%</p>
                  <p>Wind: {day.windSpeed} mph</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;