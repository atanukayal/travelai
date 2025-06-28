import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api';
import { DayItinerary, Place, Hotel } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ItineraryDisplayProps {
  destination: string;
  days: DayItinerary[];
  hotels: Hotel[];
  onRegenerate: () => void;
}

// Image cache to avoid duplicate requests
const imageCache = new Map();

// Photo icon component
const PhotoIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-12 h-12 text-gray-400 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Helper function to get place photos from Google Places API
const getPlacePhotos = async (placeId: string) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return [];
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`
    );
    
    if (!response.ok) {
      console.error('Places API request failed:', response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Places API returned error:', data.status, data.error_message);
      return [];
    }
    
    return data.result?.photos || [];
  } catch (error) {
    console.error('Error fetching place photos:', error);
    return [];
  }
};

// Helper function to get photo URL from reference
const getPhotoUrl = (photoReference: string, maxWidth = 400) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return null;
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${apiKey}`;
};

// Helper function to get street view image
const getStreetViewUrl = (coordinates: { lat: number; lng: number }, size = '600x300') => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return null;
  }
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${coordinates.lat},${coordinates.lng}&key=${apiKey}&fov=80&heading=70&pitch=0`;
};

// Cached image fetcher
const getCachedImage = async (key: string, fetchFn: () => Promise<string | null>) => {
  if (imageCache.has(key)) return imageCache.get(key);
  
  const imageUrl = await fetchFn();
  if (imageUrl) {
    imageCache.set(key, imageUrl);
  }
  return imageUrl;
};

// Main image fetching strategy
const getBestImage = async (place: Place | Hotel) => {
  const cacheKey = `place-${'placeId' in place ? place.placeId : place.name}-${place.coordinates?.lat}-${place.coordinates?.lng}`;
  
  return getCachedImage(cacheKey, async () => {
    try {
      // 1. Try any existing image URL first
      if ('imageUrl' in place && place.imageUrl) {
        console.log('Using existing imageUrl for:', place.name);
        return place.imageUrl;
      }

      // 2. Try Google Places API if placeId exists
      if ('placeId' in place && typeof place.placeId === 'string' && place.placeId.length > 0) {
        console.log('Trying Places API for:', place.name);
        const photos = await getPlacePhotos(place.placeId);
        if (photos && photos.length > 0 && photos[0].photo_reference) {
          const photoUrl = getPhotoUrl(photos[0].photo_reference);
          if (photoUrl) {
            console.log('Found Places API photo for:', place.name);
            return photoUrl;
          }
        }
      }
      
      // 3. Try Street View if coordinates exist
      if (place.coordinates && place.coordinates.lat && place.coordinates.lng) {
        console.log('Using Street View for:', place.name);
        return getStreetViewUrl(place.coordinates);
      }
      
      // 4. Fallback to null
      console.log('No image found for:', place.name);
      return null;
    } catch (error) {
      console.error('Error fetching image for place:', place.name, error);
      return null;
    }
  });
};

const ItineraryImage = ({
  place,
  alt,
  className = '',
}: {
  place: Place | Hotel;
  alt: string;
  className?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await getBestImage(place);
        setImageUrl(url);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [place]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg`}></div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}>
        <PhotoIcon />
        <div className="ml-2 text-xs text-gray-500">No image</div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg`}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Image failed to load:', imageUrl, e);
          setError(true);
        }}
        onLoad={() => {
          console.log('Image loaded successfully:', imageUrl);
        }}
      />
    </div>
  );
};

const StreetViewImage = ({
  coordinates,
  className = '',
}: {
  coordinates: { lat: number; lng: number };
  className?: string;
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates?.lat || !coordinates?.lng) {
      setError(true);
      setLoading(false);
      return;
    }

    const url = getStreetViewUrl(coordinates);
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }

    setImageUrl(url);
    setLoading(false);
  }, [coordinates]);

  if (!coordinates || error) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}>
        <PhotoIcon />
        <div className="ml-2 text-xs text-gray-500">No image available</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center`}>
        <div className="text-xs text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg`}>
      <img
        src={imageUrl!}
        alt="Street View"
        className="w-full h-full object-cover"
        onError={() => {
          console.error('Street View image failed to load:', imageUrl);
          setError(true);
        }}
        onLoad={() => {
          console.log('Street View image loaded successfully:', imageUrl);
        }}
        loading="lazy"
        crossOrigin="anonymous"
      />
      {error && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <PhotoIcon />
          <div className="ml-2 text-xs text-gray-500">Image failed to load</div>
        </div>
      )}
    </div>
  );
};

const getDirectionsPath = (places: Place[]) => {
  return places.map((p) => ({
    lat: p.coordinates.lat,
    lng: p.coordinates.lng,
  }));
};

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <ItineraryImage place={hotel} alt={hotel.name} className="w-full h-48" />
      <div className="p-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {hotel.name}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
          {hotel.address}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-gray-900 dark:text-white font-medium">
            {hotel.price}
          </span>
          <span className="flex items-center text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(Number(hotel.rating))
                    ? 'fill-current'
                    : 'fill-none stroke-current'
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Coordinates: {hotel.coordinates.lat.toFixed(4)}, {hotel.coordinates.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

const ItineraryDisplay = ({
  destination,
  days,
  hotels,
  onRegenerate,
}: ItineraryDisplayProps) => {
  const itineraryRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const handleDownloadPDF = async () => {
    if (!itineraryRef.current) return;

    try {
      // Show loading state
      const loadingElement = document.createElement('div');
      loadingElement.innerHTML = 'Generating PDF... Please wait, loading images...';
      loadingElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        text-align: center;
      `;
      document.body.appendChild(loadingElement);

      // Hide elements that shouldn't be in PDF
      const elementsToHide = Array.from(
        document.querySelectorAll('.no-print, .map-container, button')
      );
      const originalStyles: { element: HTMLElement; display: string; visibility: string }[] = [];
      
      elementsToHide.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalStyles.push({
          element: htmlEl,
          display: htmlEl.style.display,
          visibility: htmlEl.style.visibility
        });
        htmlEl.style.display = 'none';
      });

      // Get the full content height
      const originalHeight = itineraryRef.current.style.height;
      itineraryRef.current.style.height = 'auto';

      // Capture the content as canvas
      const canvas = await html2canvas(itineraryRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        height: itineraryRef.current.scrollHeight,
        width: itineraryRef.current.scrollWidth
      });

      // Initialize PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);

      // Calculate scaling
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(contentWidth / (canvasWidth * 0.264583), (pageHeight - margin * 2) / (canvasHeight * 0.264583));

      const imgWidth = canvasWidth * 0.264583 * ratio;
      const imgHeight = canvasHeight * 0.264583 * ratio;

      // If content fits on one page
      if (imgHeight <= pageHeight - margin * 2) {
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      } else {
        // Split content across multiple pages
        const pageContentHeight = pageHeight - margin * 2;
        const totalPages = Math.ceil(imgHeight / pageContentHeight);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }

          // Calculate the portion of canvas for this page
          const sourceY = (page * pageContentHeight / ratio) / 0.264583;
          const sourceHeight = Math.min(
            (pageContentHeight / ratio) / 0.264583,
            canvasHeight - sourceY
          );

          // Create a temporary canvas for this page
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCanvas.width = canvasWidth;
            tempCanvas.height = sourceHeight;
            
            // Fill with white background
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, canvasWidth, sourceHeight);
            
            // Draw the portion of the original canvas
            tempCtx.drawImage(
              canvas,
              0, sourceY, canvasWidth, sourceHeight,
              0, 0, canvasWidth, sourceHeight
            );

            const pageImgData = tempCanvas.toDataURL('image/jpeg', 0.8);
            const pageImgHeight = sourceHeight * 0.264583 * ratio;
            
            pdf.addImage(pageImgData, 'JPEG', margin, margin, imgWidth, pageImgHeight);
          }
        }
      }

      // Save the PDF
      pdf.save(`${destination}-Itinerary.pdf`);

      // Restore original styles
      originalStyles.forEach(({ element, display, visibility }) => {
        element.style.display = display;
        element.style.visibility = visibility;
      });

      // Restore original height
      itineraryRef.current.style.height = originalHeight;

      // Remove loading indicator
      document.body.removeChild(loadingElement);

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Remove loading indicator if it exists
      const loadingElement = document.querySelector('div[style*="position: fixed"]');
      if (loadingElement) {
        document.body.removeChild(loadingElement);
      }
      
      // Show error message
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading map...
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto">
      <motion.div
        ref={itineraryRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {destination} Itinerary
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Your personalized travel plan
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Regenerate
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Save as PDF
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {days.map((day) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * day.day }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Day {day.day}
                  </h3>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {day.places.map((place, index) => (
                    <div key={index} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <StreetViewImage
                            coordinates={place.coordinates}
                            className="w-full h-48"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {place.name}
                          </h4>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">
                            {place.description}
                          </p>
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Best Time to Visit
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {place.bestTime || 'Anytime'}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Ticket Price
                              </span>
                              <p className="text-gray-900 dark:text-white">
                                {place.ticketPrice || 'Free'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 pb-6 map-container">
                  <div className="mt-4 w-full h-80 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={day.places[0]?.coordinates || { lat: 0, lng: 0 }}
                      zoom={13}
                    >
                      {day.places.map((place, i) => (
                        <Marker
                          key={i}
                          position={place.coordinates}
                          label={{
                            text: String.fromCharCode(65 + i),
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                          title={place.name}
                        />
                      ))}
                      {day.places.length > 1 && (
                        <Polyline
                          path={getDirectionsPath(day.places)}
                          options={{
                            strokeColor: '#3B82F6',
                            strokeOpacity: 0.9,
                            strokeWeight: 4,
                          }}
                        />
                      )}
                    </GoogleMap>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {hotels.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recommended Hotels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <HotelCard key={index} hotel={hotel} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ItineraryDisplay;