import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders unchecked checkbox by default", () => {
    render(<Checkbox onChange={vi.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checked checkbox when checked prop is true", () => {
    render(<Checkbox checked={true} onChange={vi.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls onChange when clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Checkbox disabled onChange={vi.fn()} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("does not call onChange when disabled", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Checkbox disabled onChange={handleChange} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders with aria-label", () => {
    render(<Checkbox onChange={vi.fn()} aria-label="Select item" />);
    const checkbox = screen.getByRole("checkbox", { name: /select item/i });
    expect(checkbox).toBeInTheDocument();
  });
});
