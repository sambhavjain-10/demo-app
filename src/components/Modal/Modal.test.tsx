import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render as customRender } from "@/test/utils";
import Modal from "./Modal";

// Mock createPortal to render in the same container
vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe("Modal", () => {
  beforeEach(() => {
    // Create a portal root if it doesn't exist
    if (!document.getElementById("root")) {
      const root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = customRender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders when isOpen is true", () => {
    customRender(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    customRender(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    customRender(
      <Modal isOpen={true} onClose={vi.fn()} footer={<button>Save</button>}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    customRender(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    customRender(
      <Modal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </Modal>
    );

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("does not show close button when showCloseButton is false", () => {
    customRender(
      <Modal isOpen={true} onClose={vi.fn()} showCloseButton={false}>
        <div>Content</div>
      </Modal>
    );

    expect(screen.queryByLabelText("Close modal")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = customRender(
      <Modal isOpen={true} onClose={vi.fn()} className="custom-modal">
        <div>Content</div>
      </Modal>
    );

    const modalContent = container.querySelector(".custom-modal");
    expect(modalContent).toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    customRender(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
