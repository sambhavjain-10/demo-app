import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonTheme = "primary" | "secondary" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  children: ReactNode;
};
