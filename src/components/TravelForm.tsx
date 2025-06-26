import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, DollarSign, Heart, Mic, MicOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

interface TravelFormData {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  interests: string[];
  budget: number;
  groupType: string;
}

interface TravelFormProps {
  onGenerateItinerary: (data: TravelFormData) => void;
}

const TravelForm: React.FC<TravelFormProps> = ({ onGenerateItinerary }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<TravelFormData>({
    destination: '',
    startDate: null,
    endDate: null,
    interests: [],
    budget: 1000,
    groupType: 'solo'
  });
  const [isListening, setIsListening] = useState(false);

  const interestOptions = [
    { value: 'beaches', label: '🏖️ Beaches', color: '#3B82F6' },
    { value: 'food', label: '🍽️ Food & Dining', color: '#F59E0B' },
    { value: 'nature', label: '🌲 Nature & Hiking', color: '#10B981' },
    { value: 'history', label: '🏛️ History & Culture', color: '#8B5CF6' },
    { value: 'nightlife', label: '🌃 Nightlife', color: '#EC4899' },
    { value: 'shopping', label: '🛍️ Shopping', color: '#EF4444' },
    { value: 'adventure', label: '🎢 Adventure Sports', color: '#F97316' },
    { value: 'relaxation', label: '🧘 Relaxation & Spa', color: '#06B6D4' }
  ];

  const groupOptions = [
    { value: 'solo', label: '👤 Solo Travel' },
    { value: 'couple', label: '💑 Couple' },
    { value: 'family', label: '👨‍👩‍👧‍👦 Family' },
    { value: 'friends', label: '👥 Friends Group' }
  ];

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('🎤 Listening... Speak your destination!');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, destination: transcript }));
      toast.success(`✅ Destination set to: ${transcript}`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('❌ Voice recognition failed. Please try again.');
    };

    recognition.start();
  };

  const validateForm = (): boolean => {
    const missingFields: string[] = [];

    if (!formData.destination.trim()) {
      missingFields.push('Destination');
    }

    if (!formData.startDate) {
      missingFields.push('Start Date');
    }

    if (!formData.endDate) {
      missingFields.push('End Date');
    }

    if (formData.interests.length === 0) {
      missingFields.push('Interests');
    }

    if (!formData.groupType) {
      missingFields.push('Travel Group Type');
    }

    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(', ');
      toast.error(
        `📝 Please fill in the following required fields: ${fieldsList}`,
        {
          duration: 5000,
          style: {
            maxWidth: '400px',
          },
        }
      );
      return false;
    }

    // Additional validation for date logic
    if (formData.startDate && formData.endDate) {
      if (formData.startDate >= formData.endDate) {
        toast.error('📅 End date must be after start date');
        return false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (formData.startDate < today) {
        toast.error('📅 Start date cannot be in the past');
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

    // Show success toast
    toast.success('🎉 Generating your perfect itinerary!', {
      duration: 3000,
      icon: '✨',
    });

    // Small delay to show the success message before navigating
    setTimeout(() => {
      onGenerateItinerary(formData);
    }, 500);
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      color: isDark ? '#ffffff' : '#000000',
      minHeight: '48px',
      borderRadius: '12px',
      borderWidth: '2px',
      '&:hover': {
        borderColor: isDark ? '#6B7280' : '#9CA3AF'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? (isDark ? '#4F46E5' : '#3B82F6')
        : state.isFocused 
        ? (isDark ? '#4B5563' : '#F3F4F6')
        : 'transparent',
      color: isDark ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: isDark ? '#4B5563' : '#F3F4F6'
      }
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDark ? '#4F46E5' : '#3B82F6',
      borderRadius: '6px'
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      fontSize: '14px'
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff'
      }
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`max-w-4xl mx-auto p-8 rounded-3xl backdrop-blur-lg border ${
        isDark 
          ? 'bg-slate-800/80 border-slate-600' 
          : 'bg-white/80 border-gray-200'
      } shadow-2xl`}
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          style={{ 
            textShadow: isDark 
              ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
              : '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Plan Your Dream Trip
          </motion.span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          style={{ 
            textShadow: isDark 
              ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
              : '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <motion.span
            className="inline-block"
            whileHover={{ scale: 1.02, color: isDark ? '#60A5FA' : '#3B82F6' }}
          >
            Tell us your preferences and let AI create
          </motion.span>{' '}
          <motion.span
            className="inline-block font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            the perfect itinerary for you
          </motion.span>
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <MapPin className="inline h-4 w-4 mr-2" />
            Destination *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="Where do you want to go?"
              className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            <motion.button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white' 
                  : isDark 
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </motion.button>
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
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar className="inline h-4 w-4 mr-2" />
              Start Date *
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
              placeholderText="Select start date"
              minDate={new Date()}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Calendar className="inline h-4 w-4 mr-2" />
              End Date *
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
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
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <Heart className="inline h-4 w-4 mr-2" />
            Interests *
          </label>
          <Select
            isMulti
            options={interestOptions}
            styles={customSelectStyles}
            placeholder="What are you interested in?"
            onChange={(selected) => 
              setFormData(prev => ({ 
                ...prev, 
                interests: selected ? selected.map(item => item.value) : [] 
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
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <DollarSign className="inline h-4 w-4 mr-2" />
              Budget: ${formData.budget}
            </label>
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$500</span>
              <span>$10,000+</span>
            </div>
          </div>

          {/* Group Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Users className="inline h-4 w-4 mr-2" />
              Travel Group *
            </label>
            <Select
              options={groupOptions}
              styles={customSelectStyles}
              placeholder="Select group type"
              onChange={(selected) => 
                setFormData(prev => ({ 
                  ...prev, 
                  groupType: selected ? selected.value : 'solo' 
                }))
              }
              defaultValue={groupOptions.find(option => option.value === 'solo')}
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
              boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mr-3 text-xl"
              >
                ✨
              </motion.span>
              Generate My Perfect Itinerary
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default TravelForm;