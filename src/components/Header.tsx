import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Compass } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/80 text-white border-b border-slate-700' 
          : 'bg-white/80 text-gray-900 border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Compass className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
              Planiva
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#planner" className="hover:text-blue-600 transition-colors">Plan Trip</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </nav>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark 
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;