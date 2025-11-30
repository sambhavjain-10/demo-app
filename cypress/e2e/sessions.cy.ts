describe("Sessions Page", () => {
  beforeEach(() => {
    cy.visit("/sessions");
  });

  it("should display sessions page", () => {
    cy.findByRole("main").should("be.visible");
    cy.findByPlaceholderText(/search sessions/i).should("be.visible");
  });

  it("should open and close filters panel", () => {
    cy.waitForApp();
    // Open filters
    cy.findByRole("button", { name: /filters/i }).click();
    cy.findByRole("heading", { name: /filters/i }).should("be.visible");

    // Close filters
    cy.findByLabelText("Close filters panel").click();
    cy.findByRole("heading", { name: /filters/i }).should("not.exist");
  });

  it("should filter by team", () => {
    cy.waitForApp();
    cy.findByRole("button", { name: /filters/i }).click();
    cy.findByRole("heading", { name: /filters/i }).should("be.visible");

    // Select a team filter - find button containing "Sales" text
    cy.contains("button", "Sales").click();
    // Verify it's active (check for aria-pressed attribute)
    cy.contains("button", "Sales").should("have.attr", "aria-pressed", "true");
  });

  it("should search sessions", () => {
    const searchInput = cy.findByRole("searchbox");
    searchInput.type("test");
    searchInput.should("have.value", "test");
  });

  it("should open settings modal", () => {
    cy.waitForApp();
    // Settings button contains only an icon (Settings SVG)
    // It's the second button in the header button group (after Filters)
    cy.findByRole("button", { name: /filters/i })
      .parent()
      .find("button")
      .eq(1)
      .click();
    cy.findByRole("dialog", { timeout: 5000 }).should("be.visible");
  });

  it("should display reset filters button when filters are active", () => {
    cy.waitForApp();
    cy.findByRole("button", { name: /filters/i }).click();
    cy.findByRole("heading", { name: /filters/i }).should("be.visible");

    // Apply a filter by clicking the Sales team button
    cy.contains("button", "Sales").click();

    // Wait for state to update and reset button should appear
    cy.findByRole("button", { name: /reset all/i, timeout: 3000 }).should("be.visible");
  });
});
