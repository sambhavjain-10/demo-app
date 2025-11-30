describe("Session Details", () => {
  beforeEach(() => {
    cy.visit("/sessions");
  });

  it("should open session details modal when clicking a session row", () => {
    // Wait for sessions to load
    cy.waitForApp();

    // Find session rows by excluding header buttons (header has sticky class)
    // Session rows are in the scrollable body area
    cy.get('[role="button"]')
      .not('[class*="sticky"]')
      .not('[class*="uppercase"]') // Header has uppercase class
      .first()
      .click({ force: true });

    // Modal should open
    cy.findByRole("dialog", { timeout: 5000 }).should("be.visible");
  });

  it("should close session details modal", () => {
    cy.waitForApp();

    // Open modal by clicking a session row (exclude header buttons)
    cy.get('[role="button"]')
      .not('[class*="sticky"]')
      .not('[class*="uppercase"]') // Header has uppercase class
      .first()
      .click({ force: true });
    cy.findByRole("dialog", { timeout: 5000 }).should("be.visible");

    // Close modal
    cy.findByLabelText(/close/i).first().click({ force: true });
    cy.findByRole("dialog").should("not.exist");
  });
});
