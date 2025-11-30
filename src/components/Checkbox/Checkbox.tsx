import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import type { CheckboxProps } from "./types";

/**
 * A checkbox input component with optional label and indeterminate state support.
 *
 * @component
 * @example
 * // Basic checkbox
 * <Checkbox
 *   checked={isChecked}
 *   onChange={(e) => setIsChecked(e.target.checked)}
 *   label="Accept terms and conditions"
 * />
 *
 * @example
 * // Indeterminate checkbox (e.g., for "select all")
 * <Checkbox
 *   checked={someSelected}
 *   indeterminate={someSelected && !allSelected}
 *   onChange={handleSelectAll}
 *   label="Select all"
 * />
 *
 * @example
 * // Checkbox without label
 * <Checkbox
 *   checked={value}
 *   onChange={(e) => setValue(e.target.checked)}
 *   aria-label="Toggle option"
 * />
 *
 * @param {CheckboxProps} props - The component props
 * @param {ReactNode} [props.label] - Optional label text displayed next to the checkbox
 * @param {string} [props.className=""] - Additional CSS classes for the container
 * @param {boolean} [props.indeterminate=false] - Whether the checkbox is in indeterminate state
 * @param {boolean} [props.checked] - Whether the checkbox is checked (controlled)
 * @param {...InputHTMLAttributes} props.rest - All standard HTML input attributes except 'type'
 * @returns {JSX.Element} A checkbox input with optional label
 */
const Checkbox = ({
  label,
  className = "",
  indeterminate = false,
  checked,
  ...rest
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={twMerge("flex cursor-pointer items-center gap-2", className)}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-700"
        {...rest}
      />
      {label && <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>}
    </label>
  );
};

export default Checkbox;
