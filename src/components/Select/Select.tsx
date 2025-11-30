import { useState, useRef, useEffect, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "@/icons";
import type { SelectProps } from "./types";

/**
 * A customizable select dropdown component with keyboard navigation and accessibility support.
 *
 * @component
 * @template T - The type of the option values (string or number)
 *
 * @example
 * // Basic select
 * <Select
 *   options={[
 *     { value: "option1", label: "Option 1" },
 *     { value: "option2", label: "Option 2" }
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   placeholder="Select an option"
 * />
 *
 * @example
 * // Select with label and error state
 * <Select
 *   label="Team"
 *   options={teamOptions}
 *   value={selectedTeam}
 *   onChange={setSelectedTeam}
 *   error={errors.team}
 * />
 *
 * @example
 * // Disabled select
 * <Select
 *   options={options}
 *   value={value}
 *   onChange={onChange}
 *   disabled={isLoading}
 * />
 *
 * @param {SelectProps<T>} props - The component props
 * @param {SelectOption<T>[]} props.options - Array of selectable options
 * @param {T} [props.value] - The currently selected value
 * @param {(value: T) => void} [props.onChange] - Callback fired when selection changes
 * @param {string} [props.placeholder] - Placeholder text when no option is selected
 * @param {ReactNode} [props.label] - Optional label displayed above the select
 * @param {string} [props.error] - Error message to display below the select
 * @param {boolean} [props.disabled] - Whether the select is disabled
 * @param {string} [props.className=""] - Additional CSS classes for the container
 * @returns {JSX.Element} A styled select dropdown component
 */
const Select = <T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder,
  label,
  error,
  className = "",
  disabled,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayValue = selectedOption?.label ?? placeholder ?? "Select an option";

  const handleSelect = useCallback(
    (newValue: T) => {
      onChange?.(newValue);
      setIsOpen(false);
      setFocusedIndex(-1);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            handleSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, focusedIndex, options, handleSelect]);

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        // Set focused index to current selection when opening
        const currentIndex = value
          ? options.findIndex((opt) => String(opt.value) === String(value))
          : -1;
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      )}
      <div ref={containerRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={twMerge(
            "cursor-pointer flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-left text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20",
            error &&
              "border-rose-300 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-600 dark:focus:border-rose-400 dark:focus:ring-rose-500/20",
            disabled && "cursor-not-allowed opacity-50",
            isOpen && "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-500/20",
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label ? String(label) : "Select option"}
        >
          <span
            className={
              value !== undefined && value !== null ? "" : "text-gray-400 dark:text-gray-500"
            }
          >
            {displayValue}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform dark:text-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
              role="listbox"
            >
              {options.map((option, index) => {
                const isSelected = String(option.value) === String(value);
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={twMerge(
                      "cursor-pointer w-full px-4 py-2 text-left text-sm transition",
                      isFocused &&
                        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
                      isSelected &&
                        !isFocused &&
                        "bg-gray-50 font-semibold text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                      !isFocused &&
                        !isSelected &&
                        "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
};

export default Select;
