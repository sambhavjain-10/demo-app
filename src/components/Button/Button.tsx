import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./types";

const themeClassMap: Record<NonNullable<ButtonProps["theme"]>, string> = {
  primary:
    "btn bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400",
  secondary:
    "btn rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
  icon: "inline-flex items-center justify-center w-12 h-12 rounded-full border-0 bg-transparent text-gray-500 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 active:scale-95 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-500 cursor-pointer",
};

/**
 * A versatile button component with multiple theme variants.
 *
 * @component
 * @example
 * // Primary button (default)
 * <Button onClick={handleClick}>Click me</Button>
 *
 * @example
 * // Secondary button
 * <Button theme="secondary" onClick={handleReset}>Reset</Button>
 *
 * @example
 * // Icon button
 * <Button theme="icon" onClick={handleClose} aria-label="Close">
 *   <CloseIcon />
 * </Button>
 *
 * @param {ButtonProps} props - The component props
 * @param {ButtonTheme} [props.theme="primary"] - The visual theme variant
 * @param {string} [props.className=""] - Additional CSS classes to apply
 * @param {ReactNode} props.children - The button content
 * @param {...ButtonHTMLAttributes} props.rest - All standard HTML button attributes
 * @returns {JSX.Element} A styled button element
 */
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
