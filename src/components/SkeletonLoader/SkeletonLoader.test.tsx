import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkeletonLoader from "./SkeletonLoader";

describe("SkeletonLoader", () => {
  it("renders a single skeleton line by default", () => {
    const { container } = render(<SkeletonLoader />);
    const skeletonLines = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletonLines).toHaveLength(1);
  });

  it("renders multiple skeleton lines when lines prop is provided", () => {
    const { container } = render(<SkeletonLoader lines={5} />);
    const skeletonLines = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletonLines).toHaveLength(5);
  });

  it("has proper accessibility attributes", () => {
    render(<SkeletonLoader />);
    const container = screen.getByRole("status");
    expect(container).toHaveAttribute("aria-live", "polite");
    expect(container).toHaveAttribute("aria-busy", "true");
  });

  it("includes screen reader text", () => {
    render(<SkeletonLoader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("applies custom wrapper className", () => {
    const { container } = render(<SkeletonLoader wrapperClassName="custom-wrapper" />);
    expect(container.firstChild).toHaveClass("custom-wrapper");
  });

  it("applies custom loader className", () => {
    const { container } = render(<SkeletonLoader loaderClassName="custom-loader" />);
    const skeletonLine = container.querySelector('[class*="animate-pulse"]');
    expect(skeletonLine).toHaveClass("custom-loader");
  });

  it("merges custom classes with default classes", () => {
    const { container } = render(
      <SkeletonLoader wrapperClassName="custom-wrapper" loaderClassName="custom-loader" />
    );
    expect(container.firstChild).toHaveClass("space-y-2", "custom-wrapper");
    const skeletonLine = container.querySelector('[class*="animate-pulse"]');
    expect(skeletonLine).toHaveClass("h-10", "custom-loader");
  });
});
