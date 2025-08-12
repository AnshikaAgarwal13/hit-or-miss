/*import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed bottom-4 left-4 px-4 py-2 bg-indigo-500 text-white dark:bg-yellow-400 dark:text-black rounded-lg shadow-md hover:scale-105 transition-transform"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check the saved theme in localStorage
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');  // Store the dark mode setting
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');  // Store the light mode setting
    }
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 p-3 bg-indigo-500 text-white dark:bg-yellow-300 dark:text-black rounded-full shadow-md hover:scale-105 transition-all"
    >
      {/* Emoji Toggle with smooth transition */}
      <motion.div
        key={darkMode ? 'sun' : 'moon'} // Change the key to trigger re-render when toggled
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl" // Adjusted emoji size
      >
        {darkMode ? '🌞' : '🌙'} {/* Display Sun for Light mode, Moon for Dark mode */}
      </motion.div>
    </button>
  );
};

export default DarkModeToggle;

