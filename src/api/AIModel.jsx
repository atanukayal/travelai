import { GoogleGenAI } from "@google/genai";

async function main() {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "application/json",
    systemInstruction: `Generate a detailed travel plan in JSON format.

Input:
- Location: {{location}}
- Days: {{noOfDays}}
- Budget: {{budget}} (Cheap, Moderate, Luxury)
- Group Type: {{traveler}} (Solo, Couple, Family, Friends)

Requirements:
1. Hotel Recommendations
   - hotelName
   - address
   - price per night (approx)
   - hotelImageUrl
   - geoCoordinates (latitude, longitude)
   - rating (1–5 stars)
   - short description

2. Itinerary for each day:
   For each day include:
   - day number
   - title
   - best time to visit
   - 2–3 activity suggestions with:
     - placeName
     - placeDetails
     - placeImageUrl
     - geoCoordinates (latitude, longitude)
     - ticketPricing (Free / $)
     - timeToSpend (e.g., 1 hour)
     - timeToTravelFromHotel (in minutes)
3. Compare flights and trains 

Return the full result as a single JSON object like this:

{
  "hotels": [
    {
      "hotelName": "...",
      "address": "...",
      "price": "$...",
      "hotelImageUrl": "...",
      "geoCoordinates": [latitude, longitude],
      "rating": 4.5,
      "description": "..."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "...",
      "bestTimeToVisit": "Morning",
      "activities": [
        {
          "placeName": "...",
          "placeDetails": "...",
          "placeImageUrl": "...",
          "geoCoordinates": [latitude, longitude],
          "ticketPricing": "$...",
          "timeToSpend": "2 hours",
          "timeToTravelFromHotel": "15 minutes"
        }
      ]
    }
  ]
}

`,
  };
  const model = "gemini-2.0-flash";
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
{destination: 'Mumbai, Maharashtra, India', startDate: Sat Jun 29 2025 00:00:00 GMT+0530 (India Standard Time), endDate: Thu Jul 03 2025 00:00:00 GMT+0530 (India Standard Time), interests: Array(2), budget: 2600, …}  
budget
: 
2600
destination
: 
"Mumbai, Maharashtra, India"
endDate
: 
Thu Jul 03 2025 00:00:00 GMT+0530 (India Standard Time) {}
groupType
: 
"solo"
interests
: 
(2) ['history', 'nightlife']
startDate
: 
Sat Jun 28 2025 00:00:00 GMT+0530 (India Standard Time) {}
[[Prototype]]
: 
Object`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
{
  "hotels": [
    {
      "hotelName": "The Taj Mahal Palace, Mumbai",
      "address": "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India",
      "price": "$450",
      "hotelImageUrl": "https://images.unsplash.com/photo-1596383618152-25b0604c5476?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
      "geoCoordinates": [18.9217, 72.8333],
      "rating": 5,
      "description": "An iconic, historic luxury hotel offering unparalleled views of the Gateway of India. A perfect blend of history, opulence, and world-class service, placing you in the heart of historic Mumbai."
    },
    {
      "hotelName": "The St. Regis Mumbai",
      "address": "462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400030, India",
      "price": "$380",
      "hotelImageUrl": "https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      "geoCoordinates": [19.0069, 72.8256],
      "rating": 5,
      "description": "India's tallest hotel, located in the vibrant Lower Parel district. It offers breathtaking panoramic city views, sophisticated dining, and a vibrant nightlife scene within the hotel itself."
    },
    {
      "hotelName": "Taj Lands End, Mumbai",
      "address": "Bandstand, BJ Road, Mount Mary, Bandra West, Mumbai, Maharashtra 400050, India",
      "price": "$350",
      "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      "geoCoordinates": [19.0435, 72.8197],
      "rating": 5,
      "description": "A luxury hotel in the heart of Bandra offering stunning sea views over the Arabian Sea. It provides easy access to the city's trendiest spots, boutiques, and nightlife."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Historic South Mumbai & Colaba's Vibe",
      "bestTimeToVisit": "Afternoon / Evening",
      "activities": [
        {
          "placeName": "Gateway of India",
          "placeDetails": "Start your journey at Mumbai's most iconic landmark. This arch-monument was built in the early 20th century and stands as a testament to the city's colonial history. It's located right on the waterfront, offering great views of the Arabian Sea.",
          "placeImageUrl": "https://images.unsplash.com/photo-1563503138318-c4b8b7a60787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9220, 72.8347],
          "ticketPricing": "Free",
          "timeToSpend": "1 hour",
          "timeToTravelFromHotel": "2 minutes"
        },
        {
          "placeName": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
          "placeDetails": "Explore one of India's premier art and history museums. Housed in a magnificent Indo-Saracenic style building, it contains a vast collection of ancient artifacts, sculptures, and art from India and beyond.",
          "placeImageUrl": "https://images.unsplash.com/photo-1617369349831-a6787968a529?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9269, 72.8324],
          "ticketPricing": "$",
          "timeToSpend": "2-3 hours",
          "timeToTravelFromHotel": "5 minutes"
        },
        {
          "placeName": "Leopold Cafe & Bar",
          "placeDetails": "End your day at one of Mumbai's most famous and historic cafes. Established in 1871, it's a bustling spot popular with travelers and locals alike. A great place to feel the city's pulse and enjoy your first night out.",
          "placeImageUrl": "https://images.unsplash.com/photo-1555992336-fb0d29498b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
          "geoCoordinates": [18.9227, 72.8318],
          "ticketPricing": "$",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "5 minutes"
        }
      ]
    },
    {
      "day": 2,
      "title": "Architectural Marvels & Rooftop Views",
      "bestTimeToVisit": "Morning / Evening",
      "activities": [
        {
          "placeName": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
          "placeDetails": "Visit this UNESCO World Heritage Site, a stunning example of Victorian Gothic architecture. This historic railway station is one of the busiest in India and an architectural masterpiece.",
          "placeImageUrl": "https://images.unsplash.com/photo-1586580453034-4a613a444585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9398, 72.8355],
          "ticketPricing": "Free (to view from outside)",
          "timeToSpend": "45 minutes",
          "timeToTravelFromHotel": "10 minutes"
        },
        {
          "placeName": "Kala Ghoda Art Precinct",
          "placeDetails": "Wander through the crescent-shaped artistic hub of Mumbai. This area is filled with art galleries, museums, designer cafes, and educational institutions, showcasing the city's creative soul.",
          "placeImageUrl": "https://images.unsplash.com/photo-1617369349831-a6787968a529?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9296, 72.8317],
          "ticketPricing": "Free",
          "timeToSpend": "2 hours",
          "timeToTravelFromHotel": "5 minutes"
        },
        {
          "placeName": "Aer - Four Seasons",
          "placeDetails": "Experience Mumbai's nightlife from the 34th-floor of the Four Seasons hotel. This open-air rooftop bar offers breathtaking 360-degree views of the city skyline and the sea, perfect for a luxurious evening.",
          "placeImageUrl": "https://images.unsplash.com/photo-1594354743452-2b5f795f59bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9950, 72.8213],
          "ticketPricing": "$$",
          "timeToSpend": "2-3 hours",
          "timeToTravelFromHotel": "25 minutes"
        }
      ]
    },
    {
      "day": 3,
      "title": "Ancient Caves & Seaside Promenade",
      "bestTimeToVisit": "Morning",
      "activities": [
        {
          "placeName": "Elephanta Caves",
          "placeDetails": "Take a ferry from the Gateway of India to Elephanta Island, a UNESCO World Heritage Site. Explore the network of rock-cut caves featuring impressive sculptures dedicated to the Hindu god Shiva. A fascinating historical excursion.",
          "placeImageUrl": "https://images.unsplash.com/photo-1599586117524-73876378e63b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1854&q=80",
          "geoCoordinates": [18.9634, 72.9315],
          "ticketPricing": "$",
          "timeToSpend": "4-5 hours (including ferry)",
          "timeToTravelFromHotel": "10 minutes (to ferry point)"
        },
        {
          "placeName": "Marine Drive",
          "placeDetails": "In the evening, take a stroll along the 3.6-kilometer-long boulevard known as the 'Queen's Necklace'. Watch the sunset over the Arabian Sea and see the city lights come alive. A quintessential Mumbai experience.",
          "placeImageUrl": "https://images.unsplash.com/photo-1588225381963-324147045b85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1778&q=80",
          "geoCoordinates": [18.9432, 72.8236],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "10 minutes"
        }
      ]
    },
    {
      "day": 4,
      "title": "Bandra's Bohemian Beat & Nightlife",
      "bestTimeToVisit": "Afternoon / Evening",
      "activities": [
        {
          "placeName": "Bandra Fort (Castella de Aguada)",
          "placeDetails": "Explore the ruins of this 17th-century Portuguese fort. It offers panoramic views of the Arabian Sea and the iconic Bandra-Worli Sea Link, making it a great spot for photos and relaxation.",
          "placeImageUrl": "https://images.unsplash.com/photo-1627895423351-a07799584674?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [19.0436, 72.8191],
          "ticketPricing": "Free",
          "timeToSpend": "1 hour",
          "timeToTravelFromHotel": "50 minutes"
        },
        {
          "placeName": "Mount Mary Basilica",
          "placeDetails": "Visit this beautiful Roman Catholic Basilica perched atop a hill overlooking the sea. This historic church is known for its stunning architecture and serene atmosphere.",
          "placeImageUrl": "https://images.unsplash.com/photo-1660723049583-a7c3c5457591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
          "geoCoordinates": [19.0471, 72.8227],
          "ticketPricing": "Free",
          "timeToSpend": "45 minutes",
          "timeToTravelFromHotel": "50 minutes"
        },
        {
          "placeName": "Explore Bandra's Nightlife",
          "placeDetails": "Dive into the trendiest part of Mumbai's nightlife. Bandra West is packed with cool pubs, chic bars, and live music venues. Check out places like 'Toto's Garage Pub' for a quirky vibe or 'Bonobo' for rooftop cocktails and music.",
          "placeImageUrl": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
          "geoCoordinates": [19.0548, 72.8402],
          "ticketPricing": "$$",
          "timeToSpend": "3-4 hours",
          "timeToTravelFromHotel": "55 minutes"
        }
      ]
    },
    {
      "day": 5,
      "title": "History, Spirituality & Modern Nightlife",
      "bestTimeToVisit": "Late Morning / Evening",
      "activities": [
        {
          "placeName": "Haji Ali Dargah",
          "placeDetails": "Visit the iconic mosque and tomb of Sayyed Peer Haji Ali Shah Bukhari, located on an islet off the coast. Accessible via a narrow causeway, it's a significant spiritual and architectural landmark.",
          "placeImageUrl": "https://images.unsplash.com/photo-1605202863588-213f59239552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
          "geoCoordinates": [18.9829, 72.8118],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "30 minutes"
        },
        {
          "placeName": "Mani Bhavan Gandhi Sangrahalaya",
          "placeDetails": "Step back in time at this museum and historical building dedicated to Mahatma Gandhi. It was the focal point of Gandhi's political activities in Mumbai between 1917 and 1934. A must-visit for history enthusiasts.",
          "placeImageUrl": "https://images.unsplash.com/photo-1619329188214-f4439c0c115e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9662, 72.8101],
          "ticketPricing": "$",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "20 minutes"
        },
        {
          "placeName": "Lower Parel Nightlife (Kamala Mills/Phoenix Mills)",
          "placeDetails": "Experience the heart of modern Mumbai's nightlife in the revamped mill compounds of Lower Parel. This area is home to the city's most upscale restaurants, breweries, and high-energy clubs like KOKO or XXO at St. Regis.",
          "placeImageUrl": "https://images.unsplash.com/photo-1543007821-2948a3a0e737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [19.0084, 72.8277],
          "ticketPricing": "$$$",
          "timeToSpend": "3-4 hours",
          "timeToTravelFromHotel": "35 minutes"
        }
      ]
    },
    {
      "day": 6,
      "title": "Local Life & Departure",
      "bestTimeToVisit": "Morning",
      "activities": [
        {
          "placeName": "Dhobi Ghat (Mahalaxmi)",
          "placeDetails": "Get a glimpse of a unique part of Mumbai life at the world's largest open-air laundromat. From the viewing bridge, you can see the 'dhobis' (washermen) at work in a mesmerizing, organized chaos. A fascinating cultural and historical site.",
          "placeImageUrl": "https://images.unsplash.com/photo-1582067349193-345c2a138662?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9863, 72.8260],
          "ticketPricing": "Free",
          "timeToSpend": "30 minutes",
          "timeToTravelFromHotel": "30 minutes"
        },
        {
          "placeName": "Colaba Causeway",
          "placeDetails": "Indulge in some last-minute souvenir shopping or people-watching at this bustling street market. It's the perfect place to find everything from jewelry and clothes to books and antiques before you head home.",
          "placeImageUrl": "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
          "geoCoordinates": [18.9204, 72.8311],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "5 minutes"
        }
      ]
    }
  ]
}
\`\`\``,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `
{destination: 'Mumbai, Maharashtra, India', startDate: Sat Jun 29 2025 00:00:00 GMT+0530 (India Standard Time), endDate: Thu Jul 03 2025 00:00:00 GMT+0530 (India Standard Time), interests: Array(2), budget: 2600, …}  
budget
: 
2600
destination
: 
"Mumbai, Maharashtra, India"
endDate
: 
Thu Jul 03 2025 00:00:00 GMT+0530 (India Standard Time) {}
groupType
: 
"solo"
interests
: 
(2) ['history', 'nightlife']
startDate
: 
Sat Jun 28 2025 00:00:00 GMT+0530 (India Standard Time) {}
[[Prototype]]
: 
Object`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
{
  "hotels": [
    {
      "hotelName": "The Taj Mahal Palace, Mumbai",
      "address": "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India",
      "price": "$450",
      "hotelImageUrl": "https://images.unsplash.com/photo-1596383618152-25b0604c5476?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
      "geoCoordinates": [18.9217, 72.8333],
      "rating": 5,
      "description": "An iconic, historic luxury hotel offering unparalleled views of the Gateway of India. A perfect blend of history, opulence, and world-class service, placing you in the heart of historic Mumbai."
    },
    {
      "hotelName": "The St. Regis Mumbai",
      "address": "462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400030, India",
      "price": "$380",
      "hotelImageUrl": "https://images.unsplash.com/photo-1542314831-068cd1dbb5ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      "geoCoordinates": [19.0069, 72.8256],
      "rating": 5,
      "description": "India's tallest hotel, located in the vibrant Lower Parel district. It offers breathtaking panoramic city views, sophisticated dining, and a vibrant nightlife scene within the hotel itself."
    },
    {
      "hotelName": "Taj Lands End, Mumbai",
      "address": "Bandstand, BJ Road, Mount Mary, Bandra West, Mumbai, Maharashtra 400050, India",
      "price": "$350",
      "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      "geoCoordinates": [19.0435, 72.8197],
      "rating": 5,
      "description": "A luxury hotel in the heart of Bandra offering stunning sea views over the Arabian Sea. It provides easy access to the city's trendiest spots, boutiques, and nightlife."
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Historic South Mumbai & Colaba's Vibe",
      "bestTimeToVisit": "Afternoon / Evening",
      "activities": [
        {
          "placeName": "Gateway of India",
          "placeDetails": "Start your journey at Mumbai's most iconic landmark. This arch-monument was built in the early 20th century and stands as a testament to the city's colonial history. It's located right on the waterfront, offering great views of the Arabian Sea.",
          "placeImageUrl": "https://images.unsplash.com/photo-1563503138318-c4b8b7a60787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9220, 72.8347],
          "ticketPricing": "Free",
          "timeToSpend": "1 hour",
          "timeToTravelFromHotel": "2 minutes"
        },
        {
          "placeName": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
          "placeDetails": "Explore one of India's premier art and history museums. Housed in a magnificent Indo-Saracenic style building, it contains a vast collection of ancient artifacts, sculptures, and art from India and beyond.",
          "placeImageUrl": "https://images.unsplash.com/photo-1617369349831-a6787968a529?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9269, 72.8324],
          "ticketPricing": "$",
          "timeToSpend": "2-3 hours",
          "timeToTravelFromHotel": "5 minutes"
        },
        {
          "placeName": "Leopold Cafe & Bar",
          "placeDetails": "End your day at one of Mumbai's most famous and historic cafes. Established in 1871, it's a bustling spot popular with travelers and locals alike. A great place to feel the city's pulse and enjoy your first night out.",
          "placeImageUrl": "https://images.unsplash.com/photo-1555992336-fb0d29498b13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
          "geoCoordinates": [18.9227, 72.8318],
          "ticketPricing": "$",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "5 minutes"
        }
      ]
    },
    {
      "day": 2,
      "title": "Architectural Marvels & Rooftop Views",
      "bestTimeToVisit": "Morning / Evening",
      "activities": [
        {
          "placeName": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
          "placeDetails": "Visit this UNESCO World Heritage Site, a stunning example of Victorian Gothic architecture. This historic railway station is one of the busiest in India and an architectural masterpiece.",
          "placeImageUrl": "https://images.unsplash.com/photo-1586580453034-4a613a444585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9398, 72.8355],
          "ticketPricing": "Free (to view from outside)",
          "timeToSpend": "45 minutes",
          "timeToTravelFromHotel": "10 minutes"
        },
        {
          "placeName": "Kala Ghoda Art Precinct",
          "placeDetails": "Wander through the crescent-shaped artistic hub of Mumbai. This area is filled with art galleries, museums, designer cafes, and educational institutions, showcasing the city's creative soul.",
          "placeImageUrl": "https://images.unsplash.com/photo-1617369349831-a6787968a529?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9296, 72.8317],
          "ticketPricing": "Free",
          "timeToSpend": "2 hours",
          "timeToTravelFromHotel": "5 minutes"
        },
        {
          "placeName": "Aer - Four Seasons",
          "placeDetails": "Experience Mumbai's nightlife from the 34th-floor of the Four Seasons hotel. This open-air rooftop bar offers breathtaking 360-degree views of the city skyline and the sea, perfect for a luxurious evening.",
          "placeImageUrl": "https://images.unsplash.com/photo-1594354743452-2b5f795f59bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9950, 72.8213],
          "ticketPricing": "$$",
          "timeToSpend": "2-3 hours",
          "timeToTravelFromHotel": "25 minutes"
        }
      ]
    },
    {
      "day": 3,
      "title": "Ancient Caves & Seaside Promenade",
      "bestTimeToVisit": "Morning",
      "activities": [
        {
          "placeName": "Elephanta Caves",
          "placeDetails": "Take a ferry from the Gateway of India to Elephanta Island, a UNESCO World Heritage Site. Explore the network of rock-cut caves featuring impressive sculptures dedicated to the Hindu god Shiva. A fascinating historical excursion.",
          "placeImageUrl": "https://images.unsplash.com/photo-1599586117524-73876378e63b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1854&q=80",
          "geoCoordinates": [18.9634, 72.9315],
          "ticketPricing": "$",
          "timeToSpend": "4-5 hours (including ferry)",
          "timeToTravelFromHotel": "10 minutes (to ferry point)"
        },
        {
          "placeName": "Marine Drive",
          "placeDetails": "In the evening, take a stroll along the 3.6-kilometer-long boulevard known as the 'Queen's Necklace'. Watch the sunset over the Arabian Sea and see the city lights come alive. A quintessential Mumbai experience.",
          "placeImageUrl": "https://images.unsplash.com/photo-1588225381963-324147045b85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1778&q=80",
          "geoCoordinates": [18.9432, 72.8236],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "10 minutes"
        }
      ]
    },
    {
      "day": 4,
      "title": "Bandra's Bohemian Beat & Nightlife",
      "bestTimeToVisit": "Afternoon / Evening",
      "activities": [
        {
          "placeName": "Bandra Fort (Castella de Aguada)",
          "placeDetails": "Explore the ruins of this 17th-century Portuguese fort. It offers panoramic views of the Arabian Sea and the iconic Bandra-Worli Sea Link, making it a great spot for photos and relaxation.",
          "placeImageUrl": "https://images.unsplash.com/photo-1627895423351-a07799584674?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [19.0436, 72.8191],
          "ticketPricing": "Free",
          "timeToSpend": "1 hour",
          "timeToTravelFromHotel": "50 minutes"
        },
        {
          "placeName": "Mount Mary Basilica",
          "placeDetails": "Visit this beautiful Roman Catholic Basilica perched atop a hill overlooking the sea. This historic church is known for its stunning architecture and serene atmosphere.",
          "placeImageUrl": "https://images.unsplash.com/photo-1660723049583-a7c3c5457591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
          "geoCoordinates": [19.0471, 72.8227],
          "ticketPricing": "Free",
          "timeToSpend": "45 minutes",
          "timeToTravelFromHotel": "50 minutes"
        },
        {
          "placeName": "Explore Bandra's Nightlife",
          "placeDetails": "Dive into the trendiest part of Mumbai's nightlife. Bandra West is packed with cool pubs, chic bars, and live music venues. Check out places like 'Toto's Garage Pub' for a quirky vibe or 'Bonobo' for rooftop cocktails and music.",
          "placeImageUrl": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
          "geoCoordinates": [19.0548, 72.8402],
          "ticketPricing": "$$",
          "timeToSpend": "3-4 hours",
          "timeToTravelFromHotel": "55 minutes"
        }
      ]
    },
    {
      "day": 5,
      "title": "History, Spirituality & Modern Nightlife",
      "bestTimeToVisit": "Late Morning / Evening",
      "activities": [
        {
          "placeName": "Haji Ali Dargah",
          "placeDetails": "Visit the iconic mosque and tomb of Sayyed Peer Haji Ali Shah Bukhari, located on an islet off the coast. Accessible via a narrow causeway, it's a significant spiritual and architectural landmark.",
          "placeImageUrl": "https://images.unsplash.com/photo-1605202863588-213f59239552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
          "geoCoordinates": [18.9829, 72.8118],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "30 minutes"
        },
        {
          "placeName": "Mani Bhavan Gandhi Sangrahalaya",
          "placeDetails": "Step back in time at this museum and historical building dedicated to Mahatma Gandhi. It was the focal point of Gandhi's political activities in Mumbai between 1917 and 1934. A must-visit for history enthusiasts.",
          "placeImageUrl": "https://images.unsplash.com/photo-1619329188214-f4439c0c115e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9662, 72.8101],
          "ticketPricing": "$",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "20 minutes"
        },
        {
          "placeName": "Lower Parel Nightlife (Kamala Mills/Phoenix Mills)",
          "placeDetails": "Experience the heart of modern Mumbai's nightlife in the revamped mill compounds of Lower Parel. This area is home to the city's most upscale restaurants, breweries, and high-energy clubs like KOKO or XXO at St. Regis.",
          "placeImageUrl": "https://images.unsplash.com/photo-1543007821-2948a3a0e737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [19.0084, 72.8277],
          "ticketPricing": "$$$",
          "timeToSpend": "3-4 hours",
          "timeToTravelFromHotel": "35 minutes"
        }
      ]
    },
    {
      "day": 6,
      "title": "Local Life & Departure",
      "bestTimeToVisit": "Morning",
      "activities": [
        {
          "placeName": "Dhobi Ghat (Mahalaxmi)",
          "placeDetails": "Get a glimpse of a unique part of Mumbai life at the world's largest open-air laundromat. From the viewing bridge, you can see the 'dhobis' (washermen) at work in a mesmerizing, organized chaos. A fascinating cultural and historical site.",
          "placeImageUrl": "https://images.unsplash.com/photo-1582067349193-345c2a138662?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
          "geoCoordinates": [18.9863, 72.8260],
          "ticketPricing": "Free",
          "timeToSpend": "30 minutes",
          "timeToTravelFromHotel": "30 minutes"
        },
        {
          "placeName": "Colaba Causeway",
          "placeDetails": "Indulge in some last-minute souvenir shopping or people-watching at this bustling street market. It's the perfect place to find everything from jewelry and clothes to books and antiques before you head home.",
          "placeImageUrl": "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
          "geoCoordinates": [18.9204, 72.8311],
          "ticketPricing": "Free",
          "timeToSpend": "1.5 hours",
          "timeToTravelFromHotel": "5 minutes"
        }
      ]
    }
  ]
}
\`\`\``,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}
