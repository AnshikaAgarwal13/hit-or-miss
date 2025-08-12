import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = ['Home', 'Paging', 'Banker', 'Disk'];

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-sky-400 to-purple-500 shadow-lg rounded-b-xl">
      <div className="text-3xl font-extrabold text-white tracking-wide drop-shadow-sm">
        OS Visualizer
      </div>
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-2xl font-semibold text-sm transition-transform transform duration-300 ease-in-out 
              ${
                activeTab === tab
                  ? 'bg-white text-purple-600 shadow-lg scale-105'
                  : 'text-white hover:bg-white hover:text-purple-600 hover:scale-105'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
