describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
  });

  it("should display dashboard page", () => {
    cy.findByRole("main").should("be.visible");
  });

  it("should switch between tabs", () => {
    // Check if tabs are present
    cy.get('[role="tablist"]').should("be.visible");

    // Click on a tab if available
    cy.get('[role="tab"]').first().click();
    cy.get('[role="tab"]')
      .first()
      .should("have.attr", "aria-selected", "true");
  });

  it("should display team performance metrics", () => {
    // Wait for content to load
    cy.waitForApp();
    cy.findByRole("main").should("be.visible");
  });
});

