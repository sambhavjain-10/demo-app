describe("Responsive Design", () => {
  it("should display mobile sidebar at bottom on small screens", () => {
    cy.viewport(375, 667); // iPhone SE size
    cy.visit("/");

    cy.get("aside").should("have.class", "fixed");
    cy.get("aside").should("have.class", "bottom-0");
  });

  it("should display desktop sidebar on left on large screens", () => {
    cy.viewport(1280, 720); // Desktop size
    cy.visit("/");

    cy.get("aside").should("have.class", "md:relative");
  });

  it("should display filters as modal on mobile", () => {
    cy.viewport(375, 667);
    cy.visit("/sessions");

    cy.waitForApp();
    cy.findByRole("button", { name: /filters/i }).click();

    // Wait for the filters panel to appear and verify it's visible
    cy.findByRole("heading", { name: /filters/i, timeout: 5000 }).should("be.visible");

    // Verify it's in a fixed position (modal)
    cy.findByRole("heading", { name: /filters/i })
      .closest("aside")
      .should("have.class", "fixed")
      .and("have.class", "bottom-0");

    // Check for backdrop
    cy.get(".fixed.inset-0").should("exist");
  });

  it("should display filters as sidebar on desktop", () => {
    cy.viewport(1280, 720);
    cy.visit("/sessions");

    cy.waitForApp();
    cy.findByRole("button", { name: /filters/i }).click();

    // Wait for the filters panel to appear and verify it's visible
    cy.findByRole("heading", { name: /filters/i, timeout: 5000 }).should("be.visible");

    // Filters should be in a relative container on desktop
    cy.findByRole("heading", { name: /filters/i })
      .closest("aside")
      .should("have.class", "lg:relative");
  });
});
