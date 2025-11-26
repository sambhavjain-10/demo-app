import { useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import Button from "../Button/Button";
import { Close as CloseIcon } from "@/icons";
import type { ModalProps } from "./types";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  className = "",
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const mergedClassName = twMerge(
    "w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900",
    className
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className={mergedClassName}>
        <div className="flex items-start justify-between gap-4">
          {title && (
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</div>
          )}
          {showCloseButton && (
            <Button
              type="button"
              theme="icon"
              className="h-8 w-8 text-2xl text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseIcon size="20px" />
            </Button>
          )}
        </div>
        <div className="mt-4 text-gray-700 dark:text-gray-200">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
