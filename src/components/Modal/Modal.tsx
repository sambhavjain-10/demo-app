import { useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import Button from "../Button/Button";
import { Close as CloseIcon } from "@/icons";
import type { ModalProps } from "./types";

/**
 * A modal dialog component that renders in a portal with backdrop and keyboard support.
 *
 * @component
 * @example
 * // Basic modal
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 *
 * @example
 * // Modal with footer
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Settings"
 *   footer={
 *     <div className="flex justify-end gap-2">
 *       <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button onClick={handleSave}>Save</Button>
 *     </div>
 *   }
 * >
 *   <SettingsForm />
 * </Modal>
 *
 * @example
 * // Modal without close button
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   showCloseButton={false}
 * >
 *   <CustomCloseHandler />
 * </Modal>
 *
 * @param {ModalProps} props - The component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {() => void} props.onClose - Callback function called when modal should close (ESC key or backdrop click)
 * @param {ReactNode} [props.title] - Optional title displayed at the top of the modal
 * @param {ReactNode} props.children - The main content of the modal
 * @param {ReactNode} [props.footer] - Optional footer content displayed at the bottom
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button in the header
 * @param {string} [props.className=""] - Additional CSS classes for the modal container
 * @returns {JSX.Element | null} The modal component or null if not open
 */
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
