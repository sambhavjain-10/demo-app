import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render as customRender } from "@/test/utils";
import Sidebar from "./Sidebar";

// Mock useTheme hook
const mockToggleTheme = vi.fn();
vi.mock("@/hooks", () => ({
  useTheme: () => ({
    theme: "light" as const,
    toggleTheme: mockToggleTheme,
  }),
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it("renders all navigation links", () => {
    customRender(<Sidebar />);

    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
    expect(screen.getByLabelText("Sessions")).toBeInTheDocument();
    expect(screen.getByLabelText("Score Trends")).toBeInTheDocument();
  });

  it("renders theme toggle button", () => {
    customRender(<Sidebar />);

    expect(screen.getByLabelText(/switch to (light|dark) mode/i)).toBeInTheDocument();
  });

  it("calls toggleTheme when theme button is clicked", async () => {
    const user = userEvent.setup();
    customRender(<Sidebar />);

    const themeButton = screen.getByLabelText(/switch to (light|dark) mode/i);
    await user.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("has proper navigation structure", () => {
    customRender(<Sidebar />);

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("renders with responsive classes", () => {
    const { container } = customRender(<Sidebar />);
    const aside = container.querySelector("aside");

    expect(aside).toHaveClass("fixed", "bottom-0");
    expect(aside).toHaveClass("md:relative", "md:h-full");
  });
});
