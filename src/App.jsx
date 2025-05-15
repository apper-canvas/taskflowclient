import { useState, useEffect } from 'react';
// Main App component that handles routing, theme management, and overall layout of the application
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const BarChartIcon = getIcon('BarChart');
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  // Toggle between dark and light modes, and persist user preference in localStorage
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const navLinks = [
    { path: '/', label: 'Tasks', icon: getIcon('ListChecks') },
    { path: '/analytics', label: 'Analytics', icon: BarChartIcon }
  ];

  return (
    <div className="min-h-screen">
      <div className="fixed top-5 left-5 z-10 flex space-x-2">
        {navLinks.map(link => (
          <motion.a 
            key={link.path}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={link.path}
            className="flex items-center py-2 px-4 rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 shadow-soft hover:shadow-md transition-all"
          >
            {<link.icon size={18} className="mr-2" />}
            {link.label}
          </motion.a>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className="fixed bottom-5 right-5 z-10 p-3 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 shadow-soft hover:shadow-md transition-all"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </motion.button>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="text-sm font-medium"
      />
    </div>
  );
}

export default App;