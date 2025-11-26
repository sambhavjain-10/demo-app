import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./types";

const themeClassMap: Record<NonNullable<ButtonProps["theme"]>, string> = {
  primary:
    "btn bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",
  icon: "inline-flex items-center justify-center w-12 h-12 rounded-full border-0 bg-transparent text-gray-500 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 active:scale-95 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-500 cursor-pointer",
};

const Button = ({ theme = "primary", className = "", children, ...rest }: ButtonProps) => {
  const themeClasses = themeClassMap[theme] ?? themeClassMap.primary;
  const composedClassName = twMerge(themeClasses, className);

  return (
    <button className={composedClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;
