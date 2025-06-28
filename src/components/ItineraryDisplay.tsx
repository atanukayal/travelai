import { useState, useRef } from 'react';
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

const ItineraryImage = ({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}
      >
        <svg
          className="w-12 h-12 text-gray-400"
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
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded-lg`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
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
      // Create a new PDF with proper dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // mm

      // 1. Generate cover page
      const cover = document.createElement('div');
      cover.style.width = `${pdfWidth - margin * 2}mm`;
      cover.style.padding = '20px';
      cover.style.background = '#ffffff';
      cover.innerHTML = `
        <h1 style="font-size: 28px; color: #1a365d; text-align: center; margin-bottom: 20px;">
          ${destination} Itinerary
        </h1>
        <p style="text-align: center; color: #4a5568; margin-bottom: 30px;">
          Your personalized travel plan generated on ${new Date().toLocaleDateString()}
        </p>
        <div style="text-align: center; margin-top: 50px;">
          <p style="color: #718096;">Total days: ${days.length}</p>
          <p style="color: #718096;">Recommended hotels: ${hotels.length}</p>
        </div>
      `;
      document.body.appendChild(cover);

      const coverCanvas = await html2canvas(cover, { scale: 2 });
      document.body.removeChild(cover);

      const coverImgData = coverCanvas.toDataURL('image/png');
      pdf.addImage(coverImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.addPage();

      // 2. Process each day section
      for (const day of days) {
        const dayContainer = document.createElement('div');
        dayContainer.style.width = `${pdfWidth - margin * 2}mm`;
        dayContainer.style.padding = '10px';
        dayContainer.style.background = '#ffffff';
        
        // Create day header
        const dayHeader = document.createElement('div');
        dayHeader.innerHTML = `
          <h2 style="font-size: 22px; color: #1a365d; margin-bottom: 15px;">
            Day ${day.day}
          </h2>
        `;
        dayContainer.appendChild(dayHeader);

        // Add places for this day
        for (const place of day.places) {
          const placeDiv = document.createElement('div');
          placeDiv.style.marginBottom = '15px';
          placeDiv.style.paddingBottom = '15px';
          placeDiv.style.borderBottom = '1px solid #e2e8f0';
          
          placeDiv.innerHTML = `
            <div style="display: flex; margin-bottom: 10px;">
              <div style="flex: 1;">
                <h3 style="font-size: 18px; color: #2d3748; margin-bottom: 5px;">
                  ${place.name}
                </h3>
                <p style="color: #4a5568; margin-bottom: 10px;">
                  ${place.description}
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                    <span style="font-size: 12px; color: #718096;">Best Time to Visit</span>
                    <p style="color: #2d3748;">${place.bestTime || 'Anytime'}</p>
                  </div>
                  <div>
                    <span style="font-size: 12px; color: #718096;">Ticket Price</span>
                    <p style="color: #2d3748;">${place.ticketPrice || 'Free'}</p>
                  </div>
                </div>
              </div>
            </div>
          `;
          dayContainer.appendChild(placeDiv);
        }

        document.body.appendChild(dayContainer);
        const dayCanvas = await html2canvas(dayContainer, { scale: 2 });
        document.body.removeChild(dayContainer);

        const dayImgData = dayCanvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(dayImgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Split content across pages if too tall
        if (imgHeight > pdfHeight) {
          let position = 0;
          while (position < imgHeight) {
            const height = Math.min(pdfHeight, imgHeight - position);
            pdf.addImage(
              dayImgData,
              'PNG',
              0,
              -position,
              pdfWidth,
              imgHeight,
              undefined,
              'FAST'
            );
            position += pdfHeight - 20; // Leave some margin
            
            if (position < imgHeight) {
              pdf.addPage();
            }
          }
        } else {
          pdf.addImage(dayImgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        }

        // Add new page for next day if not last
        if (day !== days[days.length - 1] || hotels.length > 0) {
          pdf.addPage();
        }
      }

      // 3. Process hotels section if exists
      if (hotels.length > 0) {
        const hotelsContainer = document.createElement('div');
        hotelsContainer.style.width = `${pdfWidth - margin * 2}mm`;
        hotelsContainer.style.padding = '10px';
        hotelsContainer.style.background = '#ffffff';
        
        // Create hotels header
        const hotelsHeader = document.createElement('div');
        hotelsHeader.innerHTML = `
          <h2 style="font-size: 22px; color: #1a365d; margin-bottom: 15px;">
            Recommended Hotels
          </h2>
        `;
        hotelsContainer.appendChild(hotelsHeader);

        // Add hotels
        for (const hotel of hotels) {
          const hotelDiv = document.createElement('div');
          hotelDiv.style.marginBottom = '15px';
          hotelDiv.style.paddingBottom = '15px';
          hotelDiv.style.borderBottom = '1px solid #e2e8f0';
          
          hotelDiv.innerHTML = `
            <div style="display: flex; margin-bottom: 10px;">
              <div style="flex: 1;">
                <h3 style="font-size: 18px; color: #2d3748; margin-bottom: 5px;">
                  ${hotel.name}
                </h3>
                <p style="color: #4a5568; margin-bottom: 5px;">
                  ${hotel.address}
                </p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                  <span style="color: #2d3748; font-weight: 500;">${hotel.price}</span>
                  <div>
                    ${Array.from({ length: 5 }).map((_, i) => 
                      `<span style="color: ${i < Math.floor(Number(hotel.rating)) ? '#eab308' : '#d1d5db'}">★</span>`
                    ).join('')}
                  </div>
                </div>
                <p style="font-size: 12px; color: #6b7280;">
                  Coordinates: ${hotel.coordinates.lat.toFixed(4)}, ${hotel.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
          `;
          hotelsContainer.appendChild(hotelDiv);
        }

        document.body.appendChild(hotelsContainer);
        const hotelsCanvas = await html2canvas(hotelsContainer, { scale: 2 });
        document.body.removeChild(hotelsContainer);

        const hotelsImgData = hotelsCanvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(hotelsImgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Split content across pages if too tall
        if (imgHeight > pdfHeight) {
          let position = 0;
          while (position < imgHeight) {
            const height = Math.min(pdfHeight, imgHeight - position);
            pdf.addImage(
              hotelsImgData,
              'PNG',
              0,
              -position,
              pdfWidth,
              imgHeight,
              undefined,
              'FAST'
            );
            position += pdfHeight - 20; // Leave some margin
            
            if (position < imgHeight) {
              pdf.addPage();
            }
          }
        } else {
          pdf.addImage(hotelsImgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        }
      }

      pdf.save(`${destination.replace(/\s+/g, '_')}_Itinerary.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
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

          <div ref={itineraryRef} className="space-y-10">
            {days.map((day) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * day.day }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden day-section"
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
                          <ItineraryImage
                            src={place.imageUrl}
                            alt={place.name}
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
              className="mt-12 hotels-section"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recommended Hotels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <ItineraryImage
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-48"
                    />
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
                        Coordinates: {hotel.coordinates.lat.toFixed(4)},{' '}
                        {hotel.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
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