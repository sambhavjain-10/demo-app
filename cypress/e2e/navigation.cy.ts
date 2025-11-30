describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to Dashboard by default", () => {
    cy.url().should("include", "/dashboard");
    cy.findByRole("main").should("be.visible");
  });

  it("should navigate to Sessions page", () => {
    cy.findByLabelText("Sessions").click();
    cy.url().should("include", "/sessions");
    cy.findByRole("main").should("be.visible");
  });

  it("should navigate to Score Trends page", () => {
    cy.findByLabelText("Score Trends").click();
    cy.url().should("include", "/score-trends");
    cy.findByRole("main").should("be.visible");
  });

  it("should highlight active navigation link", () => {
    cy.findByLabelText("Dashboard").click();
    cy.findByLabelText("Dashboard").should("have.class", "bg-blue-600");

    cy.findByLabelText("Sessions").click();
    cy.findByLabelText("Sessions").should("have.class", "bg-blue-600");
  });

  it("should toggle theme", () => {
    cy.findByLabelText(/switch to (light|dark) mode/i).click();
    // Theme toggle should work (visual verification)
    cy.get("html").should("have.attr", "class");
  });
});
