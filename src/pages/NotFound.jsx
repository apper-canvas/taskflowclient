import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const HomeIcon = getIcon('Home');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-md w-full text-center"
      >
        <div className="mb-6 flex justify-center">
          <AlertCircleIcon className="text-accent" size={64} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/"
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <HomeIcon size={18} />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFound;