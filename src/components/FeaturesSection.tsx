// File: src/components/FeaturesSection.tsx
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Planning',
    description: 'Advanced algorithms create personalized itineraries based on your preferences'
  },
  {
    icon: '🗺️',
    title: 'Interactive Maps',
    description: 'Explore destinations with detailed maps and location-based recommendations'
  },
  {
    icon: '🌤️',
    title: 'Weather Integration',
    description: 'Real-time weather forecasts help you pack and plan activities accordingly'
  },
  {
    icon: '👥',
    title: 'Group Collaboration',
    description: 'Plan together with friends and family using shared itineraries and chat'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Planiva?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform creates personalized travel experiences tailored to your unique preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-600"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
