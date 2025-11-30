/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for the app to be ready
       * @example cy.waitForApp()
       */
      waitForApp(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForApp", () => {
  cy.get("body").should("be.visible");
  // Wait for any loading states to complete
  cy.get("[aria-busy='true']").should("not.exist");
});

export {};

