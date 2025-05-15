// Import individual icons from lucide-react for better treeshaking
import {
  CheckCircle,
  Circle,
  ListChecks,
  CalendarDays,
  Layers,
  ArrowUpDown,
  Sun,
  Moon,
  Trash,
  BarChart,
  PieChart,
  TrendingUp,
  List,
  FileDown,
  FileUp,
  Flame,
  Plus,
  Bookmark,
  X,
  ChevronDown,
  ChevronUp,
  LogOut
} from 'lucide-react';

// Map of icon names to components
const iconMap = {
  CheckCircle,
  Circle,
  ListChecks,
  Calendar: CalendarDays,
  Layers,
  ArrowUpDown,
  Sun,
  Moon,
  Trash,
  BarChart,
  PieChart,
  TrendingUp,
  List,
  FileDown,
  FileUp,
  Flame,
  Plus,
  Bookmark,
  X,
  ChevronDown,
  ChevronUp,
  LogOut
};

// Function to get an icon component by name
const getIcon = (iconName) => iconMap[iconName] || Circle;

export default getIcon;