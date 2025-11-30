import { Component, type ReactNode, type ErrorInfo } from "react";
import ErrorState from "@/components/ErrorState/ErrorState";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

/**
 * A React Error Boundary component that catches JavaScript errors in child components,
 * logs them, and displays a fallback UI using the ErrorState component.
 *
 * @component
 * @description
 * Error boundaries catch errors during rendering, in lifecycle methods, and in constructors
 * of the whole tree below them. They do NOT catch errors in event handlers, async code,
 * or during server-side rendering.
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @example
 * // With custom error messages
 * <ErrorBoundary
 *   fallbackTitle="Something went wrong"
 *   fallbackDescription="Please refresh the page."
 *   onReset={() => window.location.reload()}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * @param {ErrorBoundaryProps} props - The component props
 * @param {ReactNode} props.children - The child components to wrap
 * @param {string} [props.fallbackTitle] - Custom title for the error fallback UI
 * @param {string} [props.fallbackDescription] - Custom description for the error fallback UI
 * @param {() => void} [props.onReset] - Optional callback to reset the error state
 * @returns {JSX.Element} The error boundary wrapper component
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
    });
    // Call custom reset handler if provided
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <ErrorState
            title={this.props.fallbackTitle || "Something went wrong"}
            description={
              this.props.fallbackDescription ||
              "An unexpected error occurred. Please try refreshing the page."
            }
            onRetry={this.handleReset}
            actionLabel="Try Again"
            className="w-full max-w-md"
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
