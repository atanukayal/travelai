import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Heart,
  Mic,
  MicOff,
  Search,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";

interface TravelFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  interests: string[];
  budget: number;
  groupType: string;
}

export interface TravelFormProps {
  onGenerateItinerary: (data: TravelFormData) => void | Promise<void>;
  isLoading: boolean;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

const TravelForm: React.FC<TravelFormProps> = ({ onGenerateItinerary }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<TravelFormData>({
    destination: "",
    startDate: null,
    endDate: null,
    interests: [],
    budget: 1000,
    groupType: "solo",
  });
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [placesService, setPlacesService] = useState<any>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const destinationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Popular destinations fallback
  const popularDestinations = [
    {
      place_id: "popular_1",
      description: "Paris, France",
      main_text: "Paris",
      secondary_text: "France",
    },
    {
      place_id: "popular_2",
      description: "Tokyo, Japan",
      main_text: "Tokyo",
      secondary_text: "Japan",
    },
    {
      place_id: "popular_3",
      description: "New York, NY, USA",
      main_text: "New York",
      secondary_text: "NY, USA",
    },
    {
      place_id: "popular_4",
      description: "London, UK",
      main_text: "London",
      secondary_text: "UK",
    },
    {
      place_id: "popular_5",
      description: "Rome, Italy",
      main_text: "Rome",
      secondary_text: "Italy",
    },
    {
      place_id: "popular_6",
      description: "Barcelona, Spain",
      main_text: "Barcelona",
      secondary_text: "Spain",
    },
    {
      place_id: "popular_7",
      description: "Amsterdam, Netherlands",
      main_text: "Amsterdam",
      secondary_text: "Netherlands",
    },
    {
      place_id: "popular_8",
      description: "Sydney, Australia",
      main_text: "Sydney",
      secondary_text: "Australia",
    },
    {
      place_id: "popular_9",
      description: "Dubai, UAE",
      main_text: "Dubai",
      secondary_text: "UAE",
    },
    {
      place_id: "popular_10",
      description: "Bali, Indonesia",
      main_text: "Bali",
      secondary_text: "Indonesia",
    },
  ];

  const interestOptions = [
    { value: "beaches", label: "🏖️ Beaches", color: "#3B82F6" },
    { value: "food", label: "🍽️ Food & Dining", color: "#F59E0B" },
    { value: "nature", label: "🌲 Nature & Hiking", color: "#10B981" },
    { value: "history", label: "🏛️ History & Culture", color: "#8B5CF6" },
    { value: "nightlife", label: "🌃 Nightlife", color: "#EC4899" },
    { value: "shopping", label: "🛍️ Shopping", color: "#EF4444" },
    { value: "adventure", label: "🎢 Adventure Sports", color: "#F97316" },
    { value: "relaxation", label: "🧘 Relaxation & Spa", color: "#06B6D4" },
  ];

  const groupOptions = [
    { value: "solo", label: "👤 Solo Travel" },
    { value: "couple", label: "💑 Couple" },
    { value: "family", label: "👨‍👩‍👧‍👦 Family" },
    { value: "friends", label: "👥 Friends Group" },
  ];

  // Initialize Google Maps API
  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          // Check if the new AutocompleteSuggestion is available
          if (window.google.maps.places.AutocompleteSuggestion) {
            console.log("Using new Google Places AutocompleteSuggestion API");
            setIsGoogleMapsLoaded(true);
          } else if (window.google.maps.places.AutocompleteService) {
            console.log("Using legacy Google Places AutocompleteService API");
            const service = new window.google.maps.places.AutocompleteService();
            setPlacesService(service);
            setIsGoogleMapsLoaded(true);
          } else {
            console.warn("Google Places API not available, using fallback");
            setIsGoogleMapsLoaded(false);
          }
        } catch (error) {
          console.error("Error initializing Google Maps API:", error);
          setIsGoogleMapsLoaded(false);
          toast.error("Places API unavailable. Using popular destinations.");
        }
      } else {
        console.warn("Google Maps not loaded, using fallback destinations");
        setIsGoogleMapsLoaded(false);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google) {
      initializeGoogleMaps();
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleMaps);
          initializeGoogleMaps();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!window.google) {
          console.warn("Google Maps failed to load, using fallback");
          setIsGoogleMapsLoaded(false);
        }
      }, 10000);
    }
  }, []);

  // Handle destination input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.destination.trim() && formData.destination.length > 2) {
        searchPlaces(formData.destination);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.destination, isGoogleMapsLoaded, placesService]);

  // Search places function
  const searchPlaces = async (query: string) => {
    setIsLoadingPlaces(true);

    try {
      if (
        isGoogleMapsLoaded &&
        window.google &&
        window.google.maps &&
        window.google.maps.places
      ) {
        // First try the legacy AutocompleteService if available
        if (window.google.maps.places.AutocompleteService) {
          const service = new window.google.maps.places.AutocompleteService();
          const request = {
            input: query,
            types: ["(cities)"],
            componentRestrictions: { country: [] },
          };

          service.getPlacePredictions(
            request,
            (predictions: any, status: any) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                const placeSuggestions: PlaceSuggestion[] = predictions.map(
                  (prediction: any) => ({
                    place_id: prediction.place_id,
                    description: prediction.description,
                    main_text:
                      prediction.structured_formatting?.main_text ||
                      prediction.description,
                    secondary_text:
                      prediction.structured_formatting?.secondary_text || "",
                  })
                );
                setSuggestions(placeSuggestions);
                setShowSuggestions(true);
              } else {
                // Fallback to popular destinations
                const filtered = filterPopularDestinations(query);
                setSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
              }
            }
          );
        } else {
          // If no legacy API, use popular destinations
          const filtered = filterPopularDestinations(query);
          setSuggestions(filtered);
          setShowSuggestions(filtered.length > 0);
        }
      } else {
        // Use popular destinations fallback
        const filtered = filterPopularDestinations(query);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      // Fallback to popular destinations
      const filtered = filterPopularDestinations(query);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  // Legacy Places API function
  const useLegacyPlacesAPI = (query: string) => {
    if (placesService) {
      const request = {
        input: query,
        types: ["(cities)"],
      };

      placesService.getPlacePredictions(
        request,
        (predictions: any, status: any) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const placeSuggestions: PlaceSuggestion[] = predictions.map(
              (prediction: any) => ({
                place_id: prediction.place_id,
                description: prediction.description,
                main_text:
                  prediction.structured_formatting?.main_text ||
                  prediction.description,
                secondary_text:
                  prediction.structured_formatting?.secondary_text || "",
              })
            );
            setSuggestions(placeSuggestions);
            setShowSuggestions(true);
          } else {
            // Fallback to popular destinations
            const filtered = filterPopularDestinations(query);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
          }
        }
      );
    } else {
      // Fallback to popular destinations
      const filtered = filterPopularDestinations(query);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  // Filter popular destinations
  const filterPopularDestinations = (query: string): PlaceSuggestion[] => {
    const lowerQuery = query.toLowerCase();
    return popularDestinations.filter(
      (dest) =>
        dest.description.toLowerCase().includes(lowerQuery) ||
        dest.main_text.toLowerCase().includes(lowerQuery) ||
        dest.secondary_text.toLowerCase().includes(lowerQuery)
    );
  };

  // Handle destination selection
  const handleDestinationSelect = (suggestion: PlaceSuggestion) => {
    setFormData((prev) => ({ ...prev, destination: suggestion.description }));
    setShowSuggestions(false);
    setSuggestions([]);

    // Show success message
    toast.success(`📍 Destination set to: ${suggestion.description}`);
  };

  // Handle clicking outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        destinationInputRef.current &&
        !destinationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      toast.success("🎤 Listening... Speak your destination!");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData((prev) => ({ ...prev, destination: transcript }));
      toast.success(`✅ Destination set to: ${transcript}`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("❌ Voice recognition failed. Please try again.");
    };

    recognition.start();
  };

  const validateForm = (): boolean => {
    const missingFields: string[] = [];

    if (!formData.destination.trim()) {
      missingFields.push("Destination");
    }

    if (!formData.startDate) {
      missingFields.push("Start Date");
    }

    if (!formData.endDate) {
      missingFields.push("End Date");
    }

    if (formData.interests.length === 0) {
      missingFields.push("Interests");
    }

    if (!formData.groupType) {
      missingFields.push("Travel Group Type");
    }

    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      toast.error(
        `📝 Please fill in the following required fields: ${fieldsList}`,
        {
          duration: 5000,
          style: {
            maxWidth: "400px",
          },
        }
      );
      return false;
    }

    // Additional validation for date logic
    if (formData.startDate && formData.endDate) {
      if (formData.startDate >= formData.endDate) {
        toast.error("📅 End date must be after start date");
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (formData.startDate < today) {
        toast.error("📅 Start date cannot be in the past");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (!validateForm()) return;

    // ✅ Log to console
    console.log("Form data submitted:", formData);

    // ✅ Save to localStorage for later use
    localStorage.setItem("lastTripData", JSON.stringify(formData));

    // Show success toast
    toast.success("🎉 Generating your perfect itinerary!", {
      duration: 3000,
      icon: "✨",
    });

    // Small delay to show the success message before navigating
    setTimeout(() => {
      onGenerateItinerary(formData);
    }, 500);
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? "#374151" : "#ffffff",
      borderColor: isDark ? "#4B5563" : "#D1D5DB",
      color: isDark ? "#ffffff" : "#000000",
      minHeight: "48px",
      borderRadius: "12px",
      borderWidth: "2px",
      "&:hover": {
        borderColor: isDark ? "#6B7280" : "#9CA3AF",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? "#374151" : "#ffffff",
      borderRadius: "12px",
      boxShadow:
        "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? isDark
          ? "#4F46E5"
          : "#3B82F6"
        : state.isFocused
        ? isDark
          ? "#4B5563"
          : "#F3F4F6"
        : "transparent",
      color: isDark ? "#ffffff" : "#000000",
      "&:hover": {
        backgroundColor: isDark ? "#4B5563" : "#F3F4F6",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? "#4F46E5" : "#3B82F6",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#ffffff",
      fontSize: "14px",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`max-w-4xl mx-auto p-8 rounded-3xl backdrop-blur-lg border ${
        isDark
          ? "bg-slate-800/80 border-slate-600"
          : "bg-white/80 border-gray-200"
      } shadow-2xl`}
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-4xl font-bold mb-4 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
          style={{
            textShadow: isDark
              ? "0 4px 15px rgba(0, 0, 0, 0.3)"
              : "0 4px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Plan Your Dream Trip
          </motion.span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
          style={{
            textShadow: isDark
              ? "0 2px 8px rgba(0, 0, 0, 0.2)"
              : "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <motion.span
            className="inline-block"
            whileHover={{ scale: 1.02, color: isDark ? "#60A5FA" : "#3B82F6" }}
          >
            Tell us your preferences and let AI create
          </motion.span>{" "}
          <motion.span
            className="inline-block font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            the perfect itinerary for you
          </motion.span>
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination with Smart Autocomplete */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <MapPin className="inline h-4 w-4 mr-2" />
            Destination *
            {!isGoogleMapsLoaded && (
              <span
                className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  isDark
                    ? "bg-yellow-900 text-yellow-300"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                Using Popular Destinations
              </span>
            )}
          </label>
          <div className="relative">
            <input
              ref={destinationInputRef}
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  destination: e.target.value,
                }))
              }
              placeholder="Where do you want to go?"
              className={`w-full px-4 py-3 pr-20 rounded-xl border-2 transition-all duration-300 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />

            {/* Loading indicator */}
            {isLoadingPlaces && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="absolute right-16 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-blue-500" />
              </motion.div>
            )}

            {/* Voice input button */}
            <motion.button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isListening
                  ? "bg-red-500 text-white"
                  : isDark
                  ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </motion.button>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute z-50 w-full mt-2 rounded-xl border-2 shadow-xl ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-200"
                } max-h-60 overflow-y-auto`}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.place_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0 ${
                      isDark
                        ? "hover:bg-gray-600 border-gray-600 text-white"
                        : "hover:bg-gray-50 border-gray-200 text-gray-900"
                    }`}
                    onClick={() => handleDestinationSelect(suggestion)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          {suggestion.main_text}
                        </div>
                        {suggestion.secondary_text && (
                          <div
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {suggestion.secondary_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Date Range */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-2" />
              Start Date *
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, startDate: date }))
              }
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
              placeholderText="Select start date"
              minDate={new Date()}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-2" />
              End Date *
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, endDate: date }))
              }
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
              placeholderText="Select end date"
              minDate={formData.startDate || new Date()}
            />
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Heart className="inline h-4 w-4 mr-2" />
            Interests *
          </label>
          <Select
            isMulti
            options={interestOptions}
            styles={customSelectStyles}
            placeholder="What are you interested in?"
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                interests: selected ? selected.map((item) => item.value) : [],
              }))
            }
          />
        </motion.div>

        {/* Budget and Group Type */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Budget */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <IndianRupee className="inline h-4 w-4 mr-2" />
              Budget: ₹{formData.budget}
            </label>
            <input
              type="range"
              min="500"
              max="100000"
              step="100"
              value={formData.budget}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹500</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Group Type */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Users className="inline h-4 w-4 mr-2" />
              Travel Group *
            </label>
            <Select
              options={groupOptions}
              styles={customSelectStyles}
              placeholder="Select group type"
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  groupType: selected ? selected.value : "solo",
                }))
              }
              defaultValue={groupOptions.find(
                (option) => option.value === "solo"
              )}
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <motion.button
            type="submit"
            className="relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform-gpu overflow-hidden"
            style={{
              boxShadow:
                "0 20px 40px -12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 25px 50px -12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-3 text-xl"
              >
                ✨
              </motion.span>
              Generate My Perfect Itinerary
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-600"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* API Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-4"
        >
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
              isGoogleMapsLoaded
                ? isDark
                  ? "bg-green-900 text-green-300"
                  : "bg-green-100 text-green-800"
                : isDark
                ? "bg-yellow-900 text-yellow-300"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isGoogleMapsLoaded ? "bg-green-500" : "bg-yellow-500"
              }`}
            />
            {isGoogleMapsLoaded
              ? "Places API Connected"
              : "Using Popular Destinations"}
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TravelForm;
