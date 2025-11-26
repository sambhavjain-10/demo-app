import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonTheme = "primary" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  children: ReactNode;
};
