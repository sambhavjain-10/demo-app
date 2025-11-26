import Caution from "./caution.svg?react";
import Close from "./close.svg?react";
import Dashboard from "./dashboard.svg?react";
import Moon from "./moon.svg?react";
import Sessions from "./sessions.svg?react";
import Sun from "./sun.svg?react";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  caution: Caution,
  close: Close,
  dashboard: Dashboard,
  moon: Moon,
  sessions: Sessions,
  sun: Sun,
};

export default iconMap;
