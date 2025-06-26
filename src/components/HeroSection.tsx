import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, MapPin, Calendar, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedBeachScene from './AnimatedBeachScene';

const HeroSection: React.FC = () => {
  const { isDark } = useTheme();

  const scrollToPlanner = () => {
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <AnimatedBeachScene />
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Globe */}
        <motion.div
          className="absolute top-20 right-20"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
          }}
        >
          <Globe className={`h-16 w-16 ${isDark ? 'text-blue-300/30' : 'text-blue-400/40'}`} />
        </motion.div>

        {/* Floating Map Pins */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + (i * 0.5),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          >
            <MapPin className={`h-8 w-8 ${isDark ? 'text-purple-400/40' : 'text-purple-500/50'}`} />
          </motion.div>
        ))}

        {/* Floating Calendar Icons */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              right: `${5 + (i * 20)}%`,
              bottom: `${10 + (i * 15)}%`,
            }}
            animate={{
              rotate: [0, 180, 360],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 6 + (i * 0.8),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <Calendar className={`h-6 w-6 ${isDark ? 'text-teal-400/30' : 'text-teal-500/40'}`} />
          </motion.div>
        ))}

        {/* Floating User Groups */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${70 + (i * 10)}%`,
              top: `${60 + (i * 10)}%`,
            }}
            animate={{
              x: [-15, 15, -15],
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i * 0.6),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            <Users className={`h-10 w-10 ${isDark ? 'text-amber-400/30' : 'text-amber-500/40'}`} />
          </motion.div>
        ))}
      </div>

      {/* Gradient Overlay with 3D depth */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/90' 
          : 'bg-gradient-to-br from-white/80 via-blue-50/60 to-white/90'
      }`} />

      {/* Content with 3D Transform */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-8"
          style={{ perspective: '1000px' }}
        >
          {/* 3D Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: 'backOut' }}
            className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${
              isDark 
                ? 'bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-slate-500 text-blue-300 shadow-2xl shadow-blue-500/20' 
                : 'bg-gradient-to-r from-white/90 to-blue-50/90 border-blue-300 text-blue-700 shadow-2xl shadow-blue-500/20'
            } backdrop-blur-lg transform-gpu`}
            style={{ 
              boxShadow: isDark 
                ? '0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                : '0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-5 w-5 mr-3" />
            </motion.div>
            <span className="text-lg font-bold tracking-wide">AI-Powered Travel Planning</span>
          </motion.div>

          {/* 3D Main Heading */}
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 50, rotateX: 30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              className={`text-6xl sm:text-7xl lg:text-8xl font-black leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              style={{ 
                textShadow: isDark 
                  ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 130, 246, 0.3)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 60px rgba(59, 130, 246, 0.2)',
                transform: 'translateZ(50px)'
              }}
            >
              Plan Your Perfect
              <motion.span 
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                style={{ 
                  backgroundSize: '200% 200%',
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))'
                }}
              >
                Adventure
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
              className={`text-xl sm:text-2xl lg:text-3xl leading-relaxed ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              } max-w-4xl mx-auto`}
              style={{ 
                textShadow: isDark 
                  ? '0 2px 10px rgba(0, 0, 0, 0.3)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.1)',
                transform: 'translateZ(30px)'
              }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05, color: isDark ? '#60A5FA' : '#3B82F6' }}
                transition={{ duration: 0.2 }}
              >
                Let AI create personalized itineraries
              </motion.span>{' '}
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05, color: isDark ? '#A78BFA' : '#8B5CF6' }}
                transition={{ duration: 0.2 }}
              >
                tailored to your interests, budget, and travel style.
              </motion.span>{' '}
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05, color: isDark ? '#34D399' : '#10B981' }}
                transition={{ duration: 0.2 }}
              >
                Discover hidden gems and create unforgettable memories.
              </motion.span>
            </motion.div>
          </div>

          {/* 3D CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4"
          >
            <motion.button
              onClick={scrollToPlanner}
              className={`group relative px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-2xl transition-all duration-300 transform-gpu ${
                isDark ? 'shadow-blue-500/30' : 'shadow-blue-600/30'
              }`}
              style={{ 
                boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(20px)'
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateX: -5,
                boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
              whileTap={{ scale: 0.95, rotateX: 0 }}
            >
              <span className="flex items-center relative z-10">
                Start Planning Now
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              className={`px-10 py-5 border-3 font-bold text-lg rounded-2xl transition-all duration-300 transform-gpu ${
                isDark 
                  ? 'border-white/40 text-white hover:bg-white/10 hover:border-white/60 shadow-lg shadow-white/10' 
                  : 'border-gray-400/60 text-gray-800 hover:bg-gray-100/80 hover:border-gray-500/80 shadow-lg shadow-gray-500/20'
              }`}
              style={{ 
                backdropFilter: 'blur(10px)',
                transform: 'translateZ(15px)'
              }}
              whileHover={{ 
                scale: 1.05, 
                rotateX: -3,
                boxShadow: isDark 
                  ? '0 15px 30px -10px rgba(255, 255, 255, 0.2)' 
                  : '0 15px 30px -10px rgba(0, 0, 0, 0.15)'
              }}
              whileTap={{ scale: 0.95, rotateX: 0 }}
            >
              View Sample Trip
            </motion.button>
          </motion.div>

          {/* 3D Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            {[
              { icon: '🤖', text: 'AI-Generated Itineraries', color: 'from-blue-500 to-cyan-500' },
              { icon: '🗺️', text: 'Interactive Maps', color: 'from-purple-500 to-pink-500' },
              { icon: '🌤️', text: 'Weather Forecasts', color: 'from-amber-500 to-orange-500' },
              { icon: '📱', text: 'Mobile Optimized', color: 'from-green-500 to-teal-500' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`px-6 py-3 rounded-2xl backdrop-blur-lg border transition-all duration-300 transform-gpu ${
                  isDark 
                    ? 'bg-slate-800/60 text-gray-200 border-slate-600/50 shadow-lg shadow-slate-900/20' 
                    : 'bg-white/60 text-gray-800 border-gray-300/50 shadow-lg shadow-gray-500/10'
                }`}
                style={{ transform: 'translateZ(10px)' }}
                whileHover={{ 
                  scale: 1.08, 
                  rotateY: 5,
                  boxShadow: isDark 
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
                }}
                initial={{ opacity: 0, rotateY: -20 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: 1.4 + (index * 0.1), duration: 0.6 }}
              >
                <span className="flex items-center text-sm font-semibold">
                  <span className="text-xl mr-3">{feature.icon}</span>
                  <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.text}
                  </span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 15, 0],
          rotateX: [0, 10, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transform: 'translateZ(5px)' }}
      >
        <div className={`w-2 h-20 rounded-full ${
          isDark 
            ? 'bg-gradient-to-b from-white/60 via-blue-400/40 to-transparent shadow-lg shadow-blue-400/20' 
            : 'bg-gradient-to-b from-gray-600/60 via-blue-500/40 to-transparent shadow-lg shadow-blue-500/20'
        }`} />
      </motion.div>
    </section>
  );
};

export default HeroSection;