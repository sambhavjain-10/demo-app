import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render as customRender } from "@/test/utils";
import { useAlerts } from "@/context/AlertsContext";
import Alerts from "./Alerts";

// Test component that uses the alerts context
const TestComponent = () => {
  const { showAlert } = useAlerts();
  return (
    <div>
      <button onClick={() => showAlert("success", "Success message")}>Show Success</button>
      <button onClick={() => showAlert("error", "Error message")}>Show Error</button>
      <button
        onClick={() =>
          showAlert("success", "With CTA", {
            text: "Action",
            onClick: vi.fn(),
          })
        }
      >
        Show with CTA
      </button>
      <Alerts />
    </div>
  );
};

describe("Alerts", () => {
  it("does not render when there are no alerts", () => {
    const { container } = customRender(<Alerts />);
    expect(container.firstChild).toBeNull();
  });

  it("renders success alert", async () => {
    const user = userEvent.setup();
    customRender(<TestComponent />);

    const button = screen.getByRole("button", { name: /show success/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    // Check for success icon
    const alert = screen.getByText("Success message").closest("div");
    expect(alert).toBeInTheDocument();
  });

  it("renders error alert", async () => {
    const user = userEvent.setup();
    customRender(<TestComponent />);

    const button = screen.getByRole("button", { name: /show error/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });
  });

  it("renders CTA button when provided", async () => {
    const user = userEvent.setup();
    customRender(<TestComponent />);

    const button = screen.getByRole("button", { name: /show with cta/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
    });
  });

  it("closes alert when close button is clicked", async () => {
    const user = userEvent.setup();
    customRender(<TestComponent />);

    const showButton = screen.getByRole("button", { name: /show success/i });
    await user.click(showButton);

    await waitFor(() => {
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText("Close alert");
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText("Success message")).not.toBeInTheDocument();
    });
  });

  it("calls CTA onClick when CTA button is clicked", async () => {
    const ctaOnClick = vi.fn();
    const user = userEvent.setup();

    const TestComponentWithCTA = () => {
      const { showAlert } = useAlerts();
      return (
        <div>
          <button
            onClick={() =>
              showAlert("success", "With CTA", {
                text: "Action",
                onClick: ctaOnClick,
              })
            }
          >
            Show with CTA
          </button>
          <Alerts />
        </div>
      );
    };

    customRender(<TestComponentWithCTA />);

    const showButton = screen.getByRole("button", { name: /show with cta/i });
    await user.click(showButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /action/i })).toBeInTheDocument();
    });

    const ctaButton = screen.getByRole("button", { name: /action/i });
    await user.click(ctaButton);

    expect(ctaOnClick).toHaveBeenCalledTimes(1);
  });
});
