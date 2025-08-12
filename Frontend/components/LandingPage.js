import React from 'react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-rose-100 via-pink-200 to-pink-100 
                 dark:from-gray-800 dark:via-gray-900 dark:to-black 
                 overflow-hidden px-6"
    >
      {/* Animated background blobs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-rose-400 dark:bg-rose-600 rounded-full filter blur-2xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-200 dark:bg-pink-500 rounded-full filter blur-2xl opacity-30 animate-pulse" />

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center max-w-2xl z-10"
      >
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 80 }}
          className="text-5xl font-bold tracking-tight text-gray-800 dark:text-white mb-6"
        >
          OS Visualizer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          Explore Paging, Disk Scheduling, and Banker's Algorithm with beautiful, interactive simulations and dark mode support.
        </motion.p>

        {/* Optional hero image */}
        {/* 
        <img src="/os-diagram.svg" alt="OS Concept" className="mx-auto mt-8 w-64 opacity-80" />
        */}
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
