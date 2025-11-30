import Caution from './caution.svg?react';
import CheckCircle from './check-circle.svg?react';
import ChevronDown from './chevron-down.svg?react';
import ChevronUp from './chevron-up.svg?react';
import Close from './close.svg?react';
import Dashboard from './dashboard.svg?react';
import Moon from './moon.svg?react';
import ScoreTrends from './score-trends.svg?react';
import Search from './search.svg?react';
import Sessions from './sessions.svg?react';
import Settings from './settings.svg?react';
import SortUnsorted from './sort-unsorted.svg?react';
import Sun from './sun.svg?react';
import XCircle from './x-circle.svg?react';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "caution": Caution,
  "check-circle": CheckCircle,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "close": Close,
  "dashboard": Dashboard,
  "moon": Moon,
  "score-trends": ScoreTrends,
  "search": Search,
  "sessions": Sessions,
  "settings": Settings,
  "sort-unsorted": SortUnsorted,
  "sun": Sun,
  "x-circle": XCircle,
};

export default iconMap;