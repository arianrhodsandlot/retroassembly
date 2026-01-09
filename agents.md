# Agent Instructions

## Overview

Browser-based retro gaming platform with dual-runtime architecture (Node.js + Cloudflare Workers).

**Tech Stack**: React, React Router, Radix Themes, Tailwind CSS, SWR, i18next | Hono, Drizzle, Argon2

## Key Directories

- `src/databases/schema.ts` - Drizzle ORM schema
- `src/controllers/` - Business logic
- `src/api/routes/` - Hono API routes with `@hono/zod-validator`
- `src/api/client.ts` - Type-safe client (Hono `hc`)
- `src/pages/routes.ts` - React Router config
- `src/middlewares/` - Request context (currentUser, db)

## Commands

**Development**: `pnpm dev` (port 8000)
**Build**: `pnpm build`
**Type check**: `pnpm tsgo`
**Lint**: `pnpm oxlint --fix` (or `pnpm lint-staged` for pre-commit)
**type check**: `pnpm tsgo`

**Testing** (Playwright):

- Run all: `pnpm test`
- Run single file: `pnpm test tests/e2e/account.test.ts`
- Run by name: `pnpm test -- --grep "log in"`
- Dev mode with UI: `pnpm dev:test -- --headed --ui`

**Database migrations** (Drizzle):

- Generate: `drizzle-kit generate`
- Apply (Node): Runs automatically on serve
- Apply (Workers): `wrangler d1 migrations apply retroassembly_library`

## Code Style

**General**: Single quotes, no semicolons, 2-space indentation. File names: lower-snake-case (except `Dockerfile`).

**JavaScript/TypeScript**:

- Use function declarations (`function xx() {}`) over arrow functions
- Modern ECMAScript features preferred
- Complex transforms: `es-toolkit` helpers. Simple cases: `for of`, `.map`, `.flatMap`
- **Never use** `.reduce`, `.then`, `.catch`. Use `async/await` + `attemptAsync` from `es-toolkit`
- Error handling: Throw `HTTPException` from `hono/http-exception` for API errors
- Use luxon for date/time parsing/formatting

**React**:

- Prefer named exports. One component per file.
- `useEffect`: Only when necessary (follow React's "You Might Not Need an Effect")
- Use `clsx` for className manipulation (`import { clsx } from 'clsx'`)
- State: Jotai atoms for local state (create `atom.ts` closest to usage)
- Cleanup: `AbortController` for event listeners
- i18n: `useTranslation` or `Trans` from `react-i18next`

**Error handling**:

- Controllers: Throw `HTTPException` with status code and message
- Frontend: SWR `onError` or try/catch

## Architecture Patterns

**Database schema**:

- Base fields: `id` (nanoid), `createdAt`, `updatedAt`, `status`
- Soft delete: Filter by `eq(table.status, statusEnum.normal)` for active records
- Delete: `update(table).set({ status: statusEnum.deleted })`

**API client** (`src/api/client.ts`):

```ts
import { client, parseResponse } from '#@/api/client.ts'
const data = await parseResponse(client.users.$get())
```

**Controllers**:

```ts
export async function myController() {
  const c = getContext()
  const { db } = c.var
  // Business logic
  return result
}
```

**Runtime detection**:

```ts
import { getRuntimeKey } from 'hono/adapter'
const isWorkers = getRuntimeKey() === 'workerd'
```

**i18n** (12 languages: en, de, es, fr, it, ja, ko, pt, ru, cs, zh-cn, zh-tw):
Add key to all locale files in `src/locales/`, use `t('key')` in components.

## Key Files

- `src/constants/env.ts` - Runtime environment detection
- `src/databases/schema.ts` - Database schema
- `src/api/client.ts` - Type-safe API client
- `src/api/app.ts` - Main API app, route registration
- `src/middlewares/globals.ts` - Request context setup
- `vite.config.ts` - Dual-runtime build configuration
