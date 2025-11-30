import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders with default primary theme", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-600");
  });

  it("renders with secondary theme", () => {
    render(<Button theme="secondary">Reset</Button>);
    const button = screen.getByRole("button", { name: /reset/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-gray-100");
  });

  it("renders with icon theme", () => {
    render(
      <Button theme="icon" aria-label="Close">
        ×
      </Button>
    );
    const button = screen.getByRole("button", { name: /close/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-transparent");
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole("button", { name: /button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: /disabled/i });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("forwards HTML button attributes", () => {
    render(
      <Button type="submit" data-testid="submit-button">
        Submit
      </Button>
    );
    const button = screen.getByTestId("submit-button");
    expect(button).toHaveAttribute("type", "submit");
  });
});
