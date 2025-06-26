import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBeachScene: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sky */}
      <div className={`absolute inset-0 ${isDark 
        ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-blue-800' 
        : 'bg-gradient-to-b from-sky-300 via-sky-200 to-blue-400'
      }`} />

      {/* Stars (Dark mode only) */}
      {isDark && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Flying Airplane */}
      <motion.div
        className="absolute top-16 left-0"
        animate={{
          x: ['-100vw', '100vw'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className={`text-2xl ${isDark ? 'text-amber-400' : 'text-blue-600'}`}>
          ✈️
        </div>
      </motion.div>

      {/* Seagulls */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 10}%`,
            left: `${20 + i * 30}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        >
          <div className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            🕊️
          </div>
        </motion.div>
      ))}

      {/* Beach and Water */}
      <div className="absolute bottom-0 w-full h-1/2">
        {/* Water */}
        <div className={`w-full h-3/4 ${isDark 
          ? 'bg-gradient-to-b from-blue-800 to-blue-900' 
          : 'bg-gradient-to-b from-blue-400 to-blue-600'
        }`}>
          {/* Animated Waves */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-full h-8 ${isDark 
                ? 'bg-gradient-to-r from-transparent via-blue-300/20 to-transparent' 
                : 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
              }`}
              style={{ bottom: `${i * 15}%` }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Sand */}
        <div className={`w-full h-1/4 ${isDark 
          ? 'bg-gradient-to-b from-yellow-900 to-yellow-800' 
          : 'bg-gradient-to-b from-yellow-200 to-yellow-300'
        }`}>
          {/* Beach Items */}
          <div className="relative w-full h-full">
            {/* Beach Umbrella */}
            <motion.div
              className="absolute left-1/4 top-0"
              animate={{
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className={`text-4xl ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                🏖️
              </div>
            </motion.div>

            {/* Relaxing Person */}
            <motion.div
              className="absolute left-1/3 top-2"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className={`text-2xl ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                🏃‍♂️
              </div>
            </motion.div>

            {/* Moving Crab */}
            <motion.div
              className="absolute bottom-0"
              animate={{
                x: ['10%', '80%', '10%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              >
                <div className={`text-xl ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                  🦀
                </div>
              </motion.div>
            </motion.div>

            {/* Palm Tree */}
            <motion.div
              className="absolute right-1/4 -top-8"
              animate={{
                rotate: [-1, 1, -1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className={`text-5xl ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                🌴
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBeachScene;