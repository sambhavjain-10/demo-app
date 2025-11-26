import type { InputHTMLAttributes } from "react";

export type SearchProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;
};
