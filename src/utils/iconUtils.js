import * as Icons from 'lucide-react';

export default function getIcon(iconName) {
  return Icons[iconName] || Icons.Smile;
};

// Export specific icons to use without the getIcon function
export const {
  Bookmark,
  BookmarkX,
  Flame
} = Icons;