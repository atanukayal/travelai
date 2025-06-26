// File: src/components/Footer.tsx
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-4">Ready for Your Next Adventure?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust Planiva to create unforgettable experiences.
            Start planning your perfect trip today!
          </p>
          <motion.button
            onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Planning Now
          </motion.button>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-gray-400 text-sm">
          <p>&copy; 2025 Planiva. All rights reserved. Made with ❤️ for travelers.</p>
        </div>
      </div>
    </footer>
  );
}
