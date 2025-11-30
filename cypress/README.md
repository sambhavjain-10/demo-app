# Cypress E2E Tests

This directory contains end-to-end tests for the application using Cypress.

## Running Tests

### Open Cypress Test Runner (Interactive)
```bash
npm run e2e:open
# or
npm run cypress:open
```

### Run Tests Headless
```bash
npm run e2e
# or
npm run cypress:run
```

### Run Tests in Headed Mode
```bash
npm run cypress:run:headed
```

## Test Structure

- `cypress/e2e/` - End-to-end test files
  - `navigation.cy.ts` - Navigation and routing tests
  - `sessions.cy.ts` - Sessions page functionality tests
  - `dashboard.cy.ts` - Dashboard page tests
  - `responsive.cy.ts` - Responsive design tests
  - `alerts.cy.ts` - Alert/notification system tests

- `cypress/support/` - Support files
  - `e2e.ts` - Global test configuration
  - `commands.ts` - Custom Cypress commands

- `cypress/fixtures/` - Test data fixtures

## Writing Tests

### Using Testing Library Queries

This project uses `@testing-library/cypress` which provides semantic queries:

```typescript
// Find by role
cy.findByRole("button", { name: /submit/i }).click();

// Find by label
cy.findByLabelText("Email").type("test@example.com");

// Find by text
cy.findByText("Welcome").should("be.visible");
```

### Custom Commands

Custom commands are available in `cypress/support/commands.ts`:

```typescript
cy.waitForApp(); // Wait for app to be ready
```

## Configuration

Cypress configuration is in `cypress.config.ts`. The base URL is set to `http://localhost:3000`.

## Best Practices

1. **Use semantic queries** - Prefer `findByRole`, `findByLabelText` over CSS selectors
2. **Wait for elements** - Cypress automatically waits, but be explicit when needed
3. **Clean up** - Use `beforeEach` to reset state
4. **Test user flows** - Focus on what users actually do
5. **Keep tests independent** - Each test should be able to run in isolation

## CI/CD Integration

For CI/CD pipelines, use:
```bash
npm run cypress:run
```

This runs tests headlessly and exits with the appropriate code for CI systems.

