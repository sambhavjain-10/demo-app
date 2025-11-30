import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Search from "./Search";

describe("Search", () => {
  it("renders with placeholder", () => {
    render(<Search value="" onChange={vi.fn()} placeholder="Search sessions" />);
    const input = screen.getByPlaceholderText("Search sessions");
    expect(input).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<Search value="test query" onChange={vi.fn()} />);
    const input = screen.getByDisplayValue("test query");
    expect(input).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Search value="" onChange={vi.fn()} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards input props", () => {
    render(
      <Search
        value=""
        onChange={vi.fn()}
        inputProps={{ maxLength: 100, id: "search-input" }}
      />
    );
    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("maxLength", "100");
  });
});
