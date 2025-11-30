import type { ChangeEvent } from "react";
import { Search as SearchIcon } from "@/icons";
import type { SearchProps } from "./types";

/**
 * A search input component with integrated search icon and styling.
 *
 * @component
 * @example
 * // Basic search
 * <Search
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search sessions"
 * />
 *
 * @example
 * // Search with custom styling and input props
 * <Search
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search..."
 *   className="w-full sm:w-64"
 *   inputProps={{
 *     autoFocus: true,
 *     maxLength: 100
 *   }}
 * />
 *
 * @param {SearchProps} props - The component props
 * @param {string} props.value - The current search value (controlled)
 * @param {(value: string) => void} props.onChange - Callback fired when the search value changes
 * @param {string} [props.placeholder="Search"] - Placeholder text for the input
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {InputHTMLAttributes} [props.inputProps] - Additional props to pass to the input element
 * @returns {JSX.Element} A search input with icon
 */
const Search = ({
  value,
  placeholder = "Search",
  onChange,
  className,
  inputProps,
}: SearchProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label
      className={`flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 ${className ?? ""}`}
    >
      <SearchIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
        {...inputProps}
      />
    </label>
  );
};

export default Search;
