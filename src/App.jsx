import { useState, useEffect, createContext } from 'react';
// Main App component that handles routing, theme management, and overall layout of the application
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import Analytics from './pages/Analytics';

export const AuthContext = createContext(null);

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const BarChartIcon = getIcon('BarChart');
  const LogOutIcon = getIcon('LogOut');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const userState = useSelector((state) => state.user);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Successfully logged out");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Failed to log out");
      }
    }
  };

  // Toggle between dark and light modes, and persist user preference in localStorage
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const navLinks = [
    { path: '/', label: 'Tasks', icon: getIcon('ListChecks') },
    { path: '/analytics', label: 'Analytics', icon: BarChartIcon }
  ];

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-primary">Initializing application...</div>
    </div>;
  }

  // Check if user is authenticated
  const isAuthenticated = userState?.isAuthenticated || false;

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen">
        {isAuthenticated && (
          <>
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
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={authMethods.logout}
              className="fixed bottom-20 right-5 z-10 p-3 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-100 shadow-soft hover:shadow-md transition-all"
              aria-label="Logout"
            >
              <LogOutIcon size={20} />
            </motion.button>
          </>
        )}
        
        <Routes>
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          
          {/* Protected routes - only accessible when authenticated */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Login />} />
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
    </AuthContext.Provider>
  );
}

export default App;