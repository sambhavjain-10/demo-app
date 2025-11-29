import { useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import type { CheckboxProps } from "./types";

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
