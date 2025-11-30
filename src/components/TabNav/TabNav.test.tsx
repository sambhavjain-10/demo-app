import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabNav from "./TabNav";

const mockTabs = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

describe("TabNav", () => {
  it("renders all tabs", () => {
    render(<TabNav tabs={mockTabs} activeTab="all" onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /completed/i })).toBeInTheDocument();
  });

  it("marks active tab with aria-selected", () => {
    render(<TabNav tabs={mockTabs} activeTab="active" onChange={vi.fn()} />);

    const activeTab = screen.getByRole("tab", { name: /active/i });
    expect(activeTab).toHaveAttribute("aria-selected", "true");
  });

  it("calls onChange when tab is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TabNav tabs={mockTabs} activeTab="all" onChange={onChange} />);

    const activeTab = screen.getByRole("tab", { name: /active/i });
    await user.click(activeTab);

    expect(onChange).toHaveBeenCalledWith("active");
  });

  it("displays count when provided", () => {
    const tabsWithCounts = [
      { id: "all", label: "All", count: 42 },
      { id: "active", label: "Active", count: 5 },
    ];

    render(<TabNav tabs={tabsWithCounts} activeTab="all" onChange={vi.fn()} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies active styling to active tab", () => {
    render(<TabNav tabs={mockTabs} activeTab="active" onChange={vi.fn()} />);

    const activeTab = screen.getByRole("tab", { name: /active/i });
    expect(activeTab).toHaveClass("bg-blue-600", "text-white");
  });

  it("applies inactive styling to inactive tabs", () => {
    render(<TabNav tabs={mockTabs} activeTab="all" onChange={vi.fn()} />);

    const inactiveTab = screen.getByRole("tab", { name: /active/i });
    expect(inactiveTab).toHaveClass("bg-transparent");
  });

  it("applies custom className", () => {
    const { container } = render(
      <TabNav tabs={mockTabs} activeTab="all" onChange={vi.fn()} className="custom-tabs" />
    );

    expect(container.firstChild).toHaveClass("custom-tabs");
  });

  it("has proper ARIA attributes", () => {
    render(<TabNav tabs={mockTabs} activeTab="all" onChange={vi.fn()} />);

    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("aria-label", "Data views");
  });
});
