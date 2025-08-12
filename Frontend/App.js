import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DarkModeToggle from './components/DarkmodeToggle';
import LandingPage from './components/LandingPage';
import PagingModule from './components/PagingModule';
import DiskModule from './components/DiskModule';
import Bankers from './components/Bankers';

const App = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const renderContent = () => {
    switch (activeTab) {
      case 'Paging': return <PagingModule />;
      case 'Banker': return <Bankers />;
      case 'Disk': return <DiskModule />;
      default: return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-slate-800 dark:text-gray-100 transition-colors duration-500">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <DarkModeToggle />
      <main className="p-6 max-w-6xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
