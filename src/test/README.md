# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit and integration testing.

## Setup

Tests are configured in `vitest.config.ts` and use:

- **Vitest** - Test runner
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for tests

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are located alongside their source files with the `.test.tsx` or `.test.ts` extension.

### Example Test File Structure

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx
```

## Writing Tests

### Component Tests

Use the custom `render` function from `@/test/utils` which includes all necessary providers:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import MyComponent from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Hook Tests

Use `renderHook` from `@testing-library/react`:

```tsx
import { renderHook, act } from "@testing-library/react";
import useMyHook from "./useMyHook";

describe("useMyHook", () => {
  it("returns initial value", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });
});
```

## Test Utilities

The `src/test/utils.tsx` file provides:

- Custom `render` function with all providers (QueryClient, Router, AlertsProvider)
- Re-exports from `@testing-library/react`

## Coverage

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.

## Notes

- Tests use `jsdom` environment for DOM simulation
- All async operations should use `waitFor` or `act` from testing library
- Mock functions using Vitest's `vi.fn()` for spies
