import type { ReactNode } from "react";

export type SelectOption<T = string | number> = {
  value: T;
  label: string;
};

export type SelectProps<T extends string | number = string> = {
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
};
