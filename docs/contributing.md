# Contributing Guide

Glad see you here! Any kinds of contributions are always welcome. Before contributing, please read the [code of conduct](code_of_conduct.md).

## Bug Report Guide
You can report bugs using GitHub's issues. When reporting issues, please provide:
- What you expected vs. what actually happened
- The exact steps that led to the issue
- Your OS, browser version, if you think they are relevant to the issue.
- Screenshots, screen recordings, or error logs when possible
- Whether the issue happens consistently or intermittently

## Development Guide
### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/download/current) and [pnpm](https://pnpm.io/installation) installed or activated.
Their versions should be the same as specified in the "engines" and "packageManager" fields in [package.json](../package.json).

### Steps
Simply run following commands in a terminal then a development server will be launched.
1. Install Node.js packages
    ```sh
    pnpm i
    ```
2. Setup development environment
    ```sh
    node --run=setup
    ```
3. Run development server
    ```sh
    node --run=dev
    ```

### Tech Stack
#### Frontend
[React](https://react.dev/), [React Router](https://reactrouter.com/), [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/), [Iconify](https://iconify.design/), [Nostalgist.js](https://nostalgist.js.org/)

#### Backend
[Hono](https://hono.dev/), [React Router](https://reactrouter.com/), [Drizzle](https://orm.drizzle.team/)

#### Infrastructure
[Node.js](https://nodejs.org/) / [Cloudflare Workers](https://workers.cloudflare.com/), [SQLite](https://sqlite.org/) / [Cloudflare D1](https://www.cloudflare.com/developer-platform/products/d1/), [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)

#### External Services
[jsDelivr](https://www.jsdelivr.com/), [Supabase Auth](https://supabase.com/auth), [msleuth](https://github.com/arianrhodsandlot/msleuth)

### License
By contributing, you agree that your contributions will be licensed under its MIT License.
