import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

/**
 * Bookmark button component that handles bookmarking/unbookmarking tasks
 * @param {Object} props - Component props
 * @param {boolean} props.isBookmarked - Whether the task is bookmarked
 * @param {Function} props.onToggle - Function to call when bookmark is toggled
 * @param {number} props.size - Size of the bookmark icon
 */
function BookmarkButton({ isBookmarked, onToggle, size = 18 }) {
  const BookmarkIcon = getIcon('Bookmark');
  const BookmarkXIcon = getIcon('BookmarkX');

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className={`flex items-center justify-center transition-colors ${
        isBookmarked
          ? 'text-primary hover:text-primary-dark'
          : 'text-surface-400 hover:text-primary'
      }`}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this task"}
    >
      {isBookmarked ? <BookmarkXIcon size={size} /> : <BookmarkIcon size={size} />}
    </motion.button>
  );
}

export default BookmarkButton;