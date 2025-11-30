import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Select from "./Select";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Select", () => {
  it("renders with placeholder when no value is selected", () => {
    render(<Select options={mockOptions} onChange={vi.fn()} placeholder="Select an option" />);

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("displays selected option label", () => {
    render(<Select options={mockOptions} value="option1" onChange={vi.fn()} />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("opens dropdown when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={vi.fn()} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  it("calls onChange when option is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={onChange} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const option = screen.getByRole("option", { name: "Option 1" });
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith("option1");
  });

  it("closes dropdown after selection", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={vi.fn()} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    const option = screen.getByRole("option", { name: "Option 1" });
    await user.click(option);

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("navigates options with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={vi.fn()} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    // Should select the second option
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={vi.fn()} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("renders label when provided", () => {
    render(<Select options={mockOptions} onChange={vi.fn()} label="Select Team" />);

    expect(screen.getByText("Select Team")).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(<Select options={mockOptions} onChange={vi.fn()} error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Select options={mockOptions} onChange={vi.fn()} disabled />);

    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} onChange={vi.fn()} disabled />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks selected option with aria-selected", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} value="option2" onChange={vi.fn()} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    await waitFor(() => {
      const selectedOption = screen.getByRole("option", { name: "Option 2" });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });
  });

  it("applies custom className", () => {
    render(<Select options={mockOptions} onChange={vi.fn()} className="custom-select" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-select");
  });
});
