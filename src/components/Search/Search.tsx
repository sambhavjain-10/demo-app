import type { ChangeEvent } from "react";
import type { SearchProps } from "./types";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4 text-gray-400 dark:text-gray-500"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M10.5 3a7.5 7.5 0 0 1 5.918 12.21l4.186 4.186a1 1 0 1 1-1.414 1.414l-4.187-4.186A7.5 7.5 0 1 1 10.5 3m0 2a5.5 5.5 0 1 0 3.889 9.504l.07-.078.078-.07A5.5 5.5 0 0 0 10.5 5"
        />
      </svg>
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
