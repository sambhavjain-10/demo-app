import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  it("renders with default title and description", () => {
    render(<ErrorState />);
    expect(screen.getByText(/we couldn't load this data/i)).toBeInTheDocument();
    expect(screen.getByText(/please retry in a moment/i)).toBeInTheDocument();
  });

  it("renders with custom title and description", () => {
    render(<ErrorState title="Custom Error" description="Custom error description" />);
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
    expect(screen.getByText("Custom error description")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<ErrorState onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders with custom action label", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} actionLabel="Try Again" />);

    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<ErrorState className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
