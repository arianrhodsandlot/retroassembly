# Agent Instructions

## Overview
This is a browser-based retro gaming platform with dual-runtime architecture supporting both Node.js and Cloudflare Workers deployments.

### Tech Stack
#### Frontend
React, React Router, Radix UI, Tailwind CSS, Iconify

#### Backend
Hono, React Router, Drizzle

#### Infrastructure
Node.js / Cloudflare Workers, SQLite / Cloudflare D1, Cloudflare R2

## Structures
- Database: Drizzle ORM with SQLite, schema in `src/databases/schema.ts`
- Controllers: Business logic in `src/controllers/` (e.g., `get-roms.ts`, `create-user.ts`)
- API Routes: Hono apps in `src/api/` with validation using `@hono/zod-validator`
- Web Page Routes: File-based routing in `src/pages/routes/`

## Setup
- Install dependencies: `pnpm i`
- Start dev server: `node --run=dev`
  By default, port `8000` will be used.

## Code Style
### General Guidelines
- Avoid redundant comments. The code should be self-explanatory.
- Keep the code concise, elegant, and composable. Follow the KISS principle and the DRY principle.
- All file names should follow lower-snake-case, except for special files like `Dockerfile`.
- Prioritize readability over performance and avoid duplication.

### JavaScript/TypeScript Guidelines
- Single quotes, no semicolons, two‑space indentation
- Use function declarations (`function xx() {}`) over function expressions (`const xx = () => {}`)
- Make use of modern features from the latest ECMAScript and the latest browsers.
- For complex data transformations, use helper functions from `es-toolkit`, while using JavaScript's built-in helpers like `for of`, `.map`, `.flatMap` for simple cases. But never use `.reduce`. There is always a better way to make it clear.
- Never use `promise.then` or `promise.catch`. We prefer `async` and `await`. If error handling becomes verbose, try using `attemptAsync` from `es-toolkit`.

### React Guidelines
- When using `useEffect`, consider whether you have to. Follow the guidelines from the article "You Might Not Need an Effect" in React's official documentation.
- Always use named exports when possible.
- One file should contain only one component. When refactoring, create new files for new components as needed.
- Use `clsx` to manipulate React `className`s when necessary. Prefer `import { clsx } from 'clsx'` over `import clsx from 'clsx'`.
- Avoid prop drilling by creating atoms in the closest `atom.ts` to the current files with Jotai. Keep the atom as close to where it's used as possible.
- Implement proper ARIA attributes for complex components.
- Use `AbortController` and `AbortSignal` for event listener cleanup instead of manual removal.

## Common Tasks

### Adding New Routes
1. Create route file in `src/pages/routes/` (e.g., `my-feature.tsx`)
2. Add to `src/pages/routes.ts` routing config
3. Create page component in `src/pages/my-feature/`
4. Add loader if server data needed

### Adding Controllers
1. Create in `src/controllers/my-controller.ts`
2. Use `getContext().var` for dependencies
3. Export typed return values
4. Call from API routes or loaders

## Key Files for Context
- `src/constants/env.ts` - Runtime environment detection
- `src/controllers/utils.server.ts` - Shared controller utilities
- `src/middlewares/hono/globals.ts` - Request context setup
- `vite.config.ts` - Dual-runtime build configuration
- `react-router.config.ts` - Framework configuration
