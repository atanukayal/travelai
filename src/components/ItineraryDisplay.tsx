// // src/components/ItineraryDisplay.tsx
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { DayItinerary, Place, Hotel } from '../types';

// interface ItineraryDisplayProps {
//   destination: string;
//   days: DayItinerary[];
//   hotels: Hotel[];
//   onRegenerate: () => void;
// }

// const ItineraryImage = ({ 
//   src, 
//   alt, 
//   className 
// }: { 
//   src?: string, 
//   alt: string, 
//   className?: string 
// }) => {
//   const [error, setError] = useState(false);
//   const [loaded, setLoaded] = useState(false);

//   if (!src || error) {
//     return (
//       <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}>
//         <svg 
//           className="w-12 h-12 text-gray-400" 
//           fill="none" 
//           stroke="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={1} 
//             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className={`${className} relative overflow-hidden rounded-lg`}>
//       <img
//         src={src}
//         alt={alt}
//         className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
//         onLoad={() => setLoaded(true)}
//         onError={() => setError(true)}
//         loading="lazy"
//       />
//       {!loaded && (
//         <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//       )}
//     </div>
//   );
// };

// const ItineraryDisplay = ({ 
//   destination, 
//   days, 
//   hotels, 
//   onRegenerate 
// }: ItineraryDisplayProps) => {
//   return (
//     <section className="max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
//       >
//         <div className="p-6 md:p-8">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//                 {destination} Itinerary
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mt-2">
//                 Your personalized travel plan
//               </p>
//             </div>
//             <button
//               onClick={onRegenerate}
//               className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//             >
//               Regenerate
//             </button>
//           </div>

//           <div className="space-y-8">
//             {days.map((day: DayItinerary) => (
//               <motion.div
//                 key={day.day}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.1 * day.day }}
//                 className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
//               >
//                 <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
//                   <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                     Day {day.day}
//                   </h3>
//                 </div>
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {day.places.map((place: Place, index: number) => (
//                     <div key={index} className="p-6">
//                       <div className="flex flex-col md:flex-row gap-6">
//                         <div className="md:w-1/3">
//                           <ItineraryImage 
//                             src={place.imageUrl}
//                             alt={place.name}
//                             className="w-full h-48"
//                           />
//                         </div>
//                         <div className="md:w-2/3">
//                           <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                             {place.name}
//                           </h4>
//                           <p className="mt-2 text-gray-600 dark:text-gray-300">
//                             {place.description}
//                           </p>
//                           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Best Time to Visit
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.bestTime || 'Anytime'}
//                               </p>
//                             </div>
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Ticket Price
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.ticketPrice || 'Free'}
//                               </p>
//                             </div>
//                             <div className="sm:col-span-2">
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Location
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 Lat: {place.coordinates.lat.toFixed(4)}, Lng: {place.coordinates.lng.toFixed(4)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {hotels.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="mt-12"
//             >
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//                 Recommended Hotels
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {hotels.map((hotel: Hotel, index: number) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                   >
//                     <ItineraryImage 
//                       src={hotel.imageUrl}
//                       alt={hotel.name}
//                       className="w-full h-48"
//                     />
//                     <div className="p-4">
//                       <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                         {hotel.name}
//                       </h4>
//                       <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
//                         {hotel.address}
//                       </p>
//                       <div className="mt-3 flex justify-between items-center">
//                         <span className="text-gray-900 dark:text-white font-medium">
//                           {hotel.price}
//                         </span>
//                         <span className="flex items-center text-yellow-500">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <svg
//                               key={i}
//                               className={`w-4 h-4 ${i < Math.floor(Number(hotel.rating)) ? 'fill-current' : 'fill-none stroke-current'}`}
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                               />
//                             </svg>
//                           ))}
//                         </span>
//                       </div>
//                       <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         Coordinates: {hotel.coordinates.lat.toFixed(4)}, {hotel.coordinates.lng.toFixed(4)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default ItineraryDisplay; 

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
// import { DayItinerary, Place, Hotel } from '../types';

// interface ItineraryDisplayProps {
//   destination: string;
//   days: DayItinerary[];
//   hotels: Hotel[];
//   onRegenerate: () => void;
// }

// const ItineraryImage = ({
//   src,
//   alt,
//   className,
// }: {
//   src?: string;
//   alt: string;
//   className?: string;
// }) => {
//   const [error, setError] = useState(false);
//   const [loaded, setLoaded] = useState(false);

//   if (!src || error) {
//     return (
//       <div
//         className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}
//       >
//         <svg
//           className="w-12 h-12 text-gray-400"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1}
//             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className={`${className} relative overflow-hidden rounded-lg`}>
//       <img
//         src={src}
//         alt={alt}
//         className={`w-full h-full object-cover transition-opacity duration-300 ${
//           loaded ? 'opacity-100' : 'opacity-0'
//         }`}
//         onLoad={() => setLoaded(true)}
//         onError={() => setError(true)}
//         loading="lazy"
//       />
//       {!loaded && (
//         <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//       )}
//     </div>
//   );
// };

// const ItineraryDisplay = ({
//   destination,
//   days,
//   hotels,
//   onRegenerate,
// }: ItineraryDisplayProps) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ['places'],
//   });

//   if (!isLoaded) {
//     return <div className="text-center text-gray-500 dark:text-gray-400">Loading map...</div>;
//   }

//   return (
//     <section className="max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
//       >
//         <div className="p-6 md:p-8">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//                 {destination} Itinerary
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mt-2">
//                 Your personalized travel plan
//               </p>
//             </div>
//             <button
//               onClick={onRegenerate}
//               className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//             >
//               Regenerate
//             </button>
//           </div>

//           <div className="space-y-8">
//             {days.map((day) => (
//               <motion.div
//                 key={day.day}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.1 * day.day }}
//                 className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
//               >
//                 <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
//                   <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                     Day {day.day}
//                   </h3>
//                 </div>
//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {day.places.map((place, index) => (
//                     <div key={index} className="p-6">
//                       <div className="flex flex-col md:flex-row gap-6">
//                         <div className="md:w-1/3">
//                           <ItineraryImage
//                             src={place.imageUrl}
//                             alt={place.name}
//                             className="w-full h-48"
//                           />
//                         </div>
//                         <div className="md:w-2/3">
//                           <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                             {place.name}
//                           </h4>
//                           <p className="mt-2 text-gray-600 dark:text-gray-300">
//                             {place.description}
//                           </p>
//                           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Best Time to Visit
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.bestTime || 'Anytime'}
//                               </p>
//                             </div>
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Ticket Price
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.ticketPrice || 'Free'}
//                               </p>
//                             </div>
//                             <div className="sm:col-span-2">
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Location
//                               </span>
//                               <p className="text-gray-900 dark:text-white mb-2">
//                                 Lat: {place.coordinates.lat.toFixed(4)}, Lng: {place.coordinates.lng.toFixed(4)}
//                               </p>
//                               <div className="w-full h-60">
//                                 <GoogleMap
//                                   mapContainerStyle={{ width: '100%', height: '100%' }}
//                                   center={place.coordinates}
//                                   zoom={14}
//                                 >
//                                   <Marker position={place.coordinates} />
//                                 </GoogleMap>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Hotels section remains unchanged */}
//           {hotels.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="mt-12"
//             >
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//                 Recommended Hotels
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {hotels.map((hotel, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                   >
//                     <ItineraryImage
//                       src={hotel.imageUrl}
//                       alt={hotel.name}
//                       className="w-full h-48"
//                     />
//                     <div className="p-4">
//                       <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                         {hotel.name}
//                       </h4>
//                       <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
//                         {hotel.address}
//                       </p>
//                       <div className="mt-3 flex justify-between items-center">
//                         <span className="text-gray-900 dark:text-white font-medium">
//                           {hotel.price}
//                         </span>
//                         <span className="flex items-center text-yellow-500">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <svg
//                               key={i}
//                               className={`w-4 h-4 ${
//                                 i < Math.floor(Number(hotel.rating))
//                                   ? 'fill-current'
//                                   : 'fill-none stroke-current'
//                               }`}
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                               />
//                             </svg>
//                           ))}
//                         </span>
//                       </div>
//                       <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         Coordinates: {hotel.coordinates.lat.toFixed(4)}, {hotel.coordinates.lng.toFixed(4)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default ItineraryDisplay;
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   GoogleMap,
//   Marker,
//   Polyline,
//   useJsApiLoader,
// } from '@react-google-maps/api';
// import { DayItinerary, Place, Hotel } from '../types';

// interface ItineraryDisplayProps {
//   destination: string;
//   days: DayItinerary[];
//   hotels: Hotel[];
//   onRegenerate: () => void;
// }

// const ItineraryImage = ({
//   src,
//   alt,
//   className,
// }: {
//   src?: string;
//   alt: string;
//   className?: string;
// }) => {
//   const [error, setError] = useState(false);
//   const [loaded, setLoaded] = useState(false);

//   if (!src || error) {
//     return (
//       <div
//         className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg`}
//       >
//         <svg
//           className="w-12 h-12 text-gray-400"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1}
//             d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//           />
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className={`${className} relative overflow-hidden rounded-lg`}>
//       <img
//         src={src}
//         alt={alt}
//         className={`w-full h-full object-cover transition-opacity duration-300 ${
//           loaded ? 'opacity-100' : 'opacity-0'
//         }`}
//         onLoad={() => setLoaded(true)}
//         onError={() => setError(true)}
//         loading="lazy"
//       />
//       {!loaded && (
//         <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
//       )}
//     </div>
//   );
// };

// const getDirectionsPath = (places: Place[]) => {
//   return places.map((p) => ({
//     lat: p.coordinates.lat,
//     lng: p.coordinates.lng,
//   }));
// };

// const ItineraryDisplay = ({
//   destination,
//   days,
//   hotels,
//   onRegenerate,
// }: ItineraryDisplayProps) => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries: ['places'],
//   });

//   if (!isLoaded) {
//     return (
//       <div className="text-center text-gray-500 dark:text-gray-400">
//         Loading map...
//       </div>
//     );
//   }

//   return (
//     <section className="max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
//       >
//         <div className="p-6 md:p-8">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//                 {destination} Itinerary
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mt-2">
//                 Your personalized travel plan
//               </p>
//             </div>
//             <button
//               onClick={onRegenerate}
//               className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
//             >
//               Regenerate
//             </button>
//           </div>

//           <div className="space-y-10">
//             {days.map((day) => (
//               <motion.div
//                 key={day.day}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.1 * day.day }}
//                 className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
//               >
//                 <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
//                   <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                     Day {day.day}
//                   </h3>
//                 </div>

//                 <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                   {day.places.map((place, index) => (
//                     <div key={index} className="p-6">
//                       <div className="flex flex-col md:flex-row gap-6">
//                         <div className="md:w-1/3">
//                           <ItineraryImage
//                             src={place.imageUrl}
//                             alt={place.name}
//                             className="w-full h-48"
//                           />
//                         </div>
//                         <div className="md:w-2/3">
//                           <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                             {place.name}
//                           </h4>
//                           <p className="mt-2 text-gray-600 dark:text-gray-300">
//                             {place.description}
//                           </p>
//                           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Best Time to Visit
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.bestTime || 'Anytime'}
//                               </p>
//                             </div>
//                             <div>
//                               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
//                                 Ticket Price
//                               </span>
//                               <p className="text-gray-900 dark:text-white">
//                                 {place.ticketPrice || 'Free'}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Map with polyline and markers for the day's places */}
//                 <div className="px-6 pb-6">
//                   <div className="mt-4 w-full h-80 rounded-lg overflow-hidden">
//                     <GoogleMap
//                       mapContainerStyle={{ width: '100%', height: '100%' }}
//                       center={day.places[0]?.coordinates || { lat: 0, lng: 0 }}
//                       zoom={13}
//                     >
//                       {day.places.map((place, i) => (
//                         <Marker
//                           key={i}
//                           position={place.coordinates}
//                           label={{
//                             text: String.fromCharCode(65 + i), // A, B, C
//                             fontWeight: 'bold',
//                             fontSize: '14px',
//                           }}
//                           title={place.name}
//                         />
//                       ))}
//                       {day.places.length > 1 && (
//                         <Polyline
//                           path={getDirectionsPath(day.places)}
//                           options={{
//                             strokeColor: '#3B82F6',
//                             strokeOpacity: 0.9,
//                             strokeWeight: 4,
//                           }}
//                         />
//                       )}
//                     </GoogleMap>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Hotels Section */}
//           {hotels.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="mt-12"
//             >
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//                 Recommended Hotels
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {hotels.map((hotel, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//                   >
//                     <ItineraryImage
//                       src={hotel.imageUrl}
//                       alt={hotel.name}
//                       className="w-full h-48"
//                     />
//                     <div className="p-4">
//                       <h4 className="text-lg font-medium text-gray-900 dark:text-white">
//                         {hotel.name}
//                       </h4>
//                       <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
//                         {hotel.address}
//                       </p>
//                       <div className="mt-3 flex justify-between items-center">
//                         <span className="text-gray-900 dark:text-white font-medium">
//                           {hotel.price}
//                         </span>
//                         <span className="flex items-center text-yellow-500">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <svg
//                               key={i}
//                               className={`w-4 h-4 ${
//                                 i < Math.floor(Number(hotel.rating))
//                                   ? 'fill-current'
//                                   : 'fill-none stroke-current'
//                               }`}
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={1.5}
//                                 d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                               />
//                             </svg>
//                           ))}
//                         </span>
//                       </div>
//                       <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
//                         Coordinates: {hotel.coordinates.lat.toFixed(4)},{' '}
//                         {hotel.coordinates.lng.toFixed(4)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default ItineraryDisplay;
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from '@react-google-maps/api';
import { DayItinerary, Place, Hotel } from '../types';

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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Define the desired location (adjust these coordinates as needed)
  const desiredLocation = { lat: 28.6139, lng: 77.2090 };

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
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Regenerate
            </button>
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

                {/* Map with polyline and markers for the day's places */}
                <div className="px-6 pb-6">
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
                            text: String.fromCharCode(65 + i), // A, B, C
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
                      {/* Desired Location Marker using longitude and latitude */}
                      <Marker
                        position={desiredLocation}
                        label={{
                          text: 'D',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                        title="Desired Location"
                      />
                    </GoogleMap>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hotels Section */}
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
