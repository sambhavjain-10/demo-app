# Frontend App

A modern React application built with TypeScript, Vite, and Tailwind CSS for managing sessions, analytics, and user data with a beautiful, responsive UI.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Bundle Size Analysis](#bundle-size-analysis)
- [Lighthouse Score](#lighthouse-score)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)

## Setup Instructions

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or use yarn/pnpm)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your configuration values (see [Environment Variables](#environment-variables) section).

4. **Generate icon system** (if needed)

   ```bash
   npm run generate-icons
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## Available Scripts

### Development

| Script                   | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `npm run dev`            | Starts the development server on port 3000 with hot module replacement (HMR) |
| `npm run build`          | Compiles TypeScript and builds the production bundle using Vite              |
| `npm run preview`        | Previews the production build locally on port 3000                           |
| `npm run generate-icons` | Generates the icon component system from SVG files in `src/icons/assets/`    |

### Code Quality

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run lint`     | Runs ESLint to check for code quality issues       |
| `npm run lint:fix` | Automatically fixes ESLint errors where possible   |
| `npm run format`   | Formats code using Prettier for consistent styling |

### Testing

#### Unit/Integration Tests (Vitest)

| Script                  | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `npm run test`          | Runs Vitest in watch mode (interactive)                    |
| `npm run test:ui`       | Opens Vitest UI for interactive test running and debugging |
| `npm run test:run`      | Runs all tests once and exits (useful for CI/CD)           |
| `npm run test:coverage` | Runs tests and generates coverage report                   |

#### End-to-End Tests (Cypress)

| Script                       | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| `npm run test:e2e`           | Runs Cypress tests in headless mode (CI/CD friendly) |
| `npm run cypress:open`       | Opens Cypress Test Runner (interactive GUI)          |
| `npm run cypress:run`        | Runs Cypress tests in headless mode                  |
| `npm run cypress:run:headed` | Runs Cypress tests with browser visible              |
| `npm run e2e:open`           | Alias for `cypress:open`                             |

## Environment Variables

The application uses environment variables prefixed with `VITE_` (Vite's convention for exposing variables to the client).

### Required Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:8000/api
```

### Environment Variable Usage

- **Development**: Create a `.env` file in the root directory
- **Production**: Set environment variables in your deployment platform (Vercel, Netlify, etc.)
- **Note**: Variables must be prefixed with `VITE_` to be accessible in the client-side code

### Example `.env` file

```env
VITE_BACKEND_URL=https://api.example.com
```

## Bundle Size Analysis

### Current Bundle Sizes

The following bundle sizes are from the latest production build:

| File                         | Size      | Gzipped  | Description                     |
| ---------------------------- | --------- | -------- | ------------------------------- |
| `index.html`                 | 0.50 kB   | 0.32 kB  | HTML entry point                |
| `index-BN3rmXiX.css`         | 43.09 kB  | 7.68 kB  | Global CSS styles               |
| `index-1FSHYv0n.js`          | 293.67 kB | 93.66 kB | Main application bundle         |
| `CartesianChart-Ce4y43Jy.js` | 322.97 kB | 98.09 kB | Recharts library (code split)   |
| `Sessions-CIH-7yeY.js`       | 58.02 kB  | 16.76 kB | Sessions page (lazy loaded)     |
| `Dashboard-CpSSCTLd.js`      | 31.11 kB  | 9.76 kB  | Dashboard page (lazy loaded)    |
| `ScoreTrends-DVUDey8T.js`    | 29.04 kB  | 8.90 kB  | Score Trends page (lazy loaded) |
| `api-CDOBQN3Y.js`            | 45.23 kB  | 17.70 kB | API utilities (shared chunk)    |
| `Modal-CmDQLUR5.js`          | 1.88 kB   | 0.89 kB  | Modal component (shared chunk)  |

### Bundle Size Summary

- **Total JavaScript**: ~782 KB (uncompressed) / ~246 KB (gzipped)
- **Total CSS**: 43.09 KB (uncompressed) / 7.68 KB (gzipped)
- **Initial Load**: ~101 KB (gzipped) - Main bundle (93.66 KB) + CSS (7.68 KB)
- **Largest Chunk**: CartesianChart (322.97 KB / 98.09 KB gzipped) - Recharts library

### Target Bundle Sizes

- **Initial bundle**: < 200 KB (gzipped) ✅ **Current: ~101 KB** (excellent)
- **Total bundle**: < 500 KB (gzipped) ✅ **Current: ~254 KB** (within target)
- **Chunk size**: < 100 KB per chunk (gzipped) ⚠️ **CartesianChart: 98.09 KB** (at limit)

### Optimization Strategies

- ✅ Code splitting by route (implemented)
- ✅ Lazy loading of heavy components (implemented)
- ✅ Tree shaking unused dependencies
- ✅ SVG icon optimization
- 🔄 Consider dynamic import for Recharts to reduce initial bundle
- 🔄 Further optimize CartesianChart chunk if it grows beyond 100 KB

## Lighthouse Score

Lighthouse audits should be run regularly to ensure optimal performance. Target scores:

| Metric         | Target Score | Current Score |
| -------------- | ------------ | ------------- |
| Performance    | 90+          | 100           |
| Accessibility  | 95+          | 96            |
| Best Practices | 90+          | 96            |
| SEO            | 90+          | 82            |

## Known Limitations & Future Improvements

### Current Limitations

1. **WebSocket Implementation**
   - WebSocket connection is currently commented out in the Sessions page
   - Real-time updates are not fully implemented
   - Reconnection logic needs completion

2. **Accessibility**
   - Some text colors have accessibility issues

3. **Testing**
   - Test coverage could be expanded for edge cases

### Future Improvements

- [ ] Complete WebSocket implementation with proper reconnection logic
- [ ] Expand unit test coverage for edge cases
- [ ] Expand E2E test coverage for all user flows
- [ ] Add data export functionality (CSV, PDF)

## Technology Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.9.6
- **Data Access State Management**: TanStack Query (React Query) 5.90.10
- **HTTP Client**: Axios 1.13.2
- **Charts**: Recharts 3.5.0
- **Virtualization**: TanStack Virtual 3.13.12
- **Unit/Integration Testing**: Vitest 4.0.14
- **E2E Testing**: Cypress 15.7.0
- **Testing Utilities**: Testing Library (React, Jest-DOM, User Event, Cypress)

## Project Structure

```
frontend-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── data-access/    # API and data fetching logic
│   ├── context/        # React context providers
│   ├── icons/          # Icon system
│   ├── types/          # TypeScript type definitions
│   └── index.css       # Global styles
├── public/             # Static assets
├── dist/               # Production build output
└── package.json        # Dependencies and scripts
```
