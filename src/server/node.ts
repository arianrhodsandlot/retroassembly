import '../utils/server/migration/initalization.ts'
import '../utils/server/migration/raw-metadata.ts'
import { serveStatic } from '@hono/node-server/serve-static'
import { handler } from 'hono-react-router-adapter/node'
import { RouterContextProvider, type ServerBuild } from 'react-router'
import { getBaseUrl, stripBase } from '../utils/server/base-url.ts'
import { applyRuntimeBaseUrl } from '../utils/server/runtime-base-build.ts'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we can not guarantee that this file exists
import * as build from '../../dist/server/index.js'
import app from './app.ts'

const baseUrl = getBaseUrl()

// Expose the resolved base to SSR-side withClientBase (where `window` is undefined). The base is a
// single process-wide env value, so it is safe to stamp once on the global at startup.
;(globalThis as { RETROASSEMBLY_BASE_URL?: string }).RETROASSEMBLY_BASE_URL = baseUrl

// Patch the base-agnostic build with the runtime subpath (no-op when hosting at the root).
const runtimeBuild = applyRuntimeBaseUrl(build as unknown as ServerBuild, baseUrl)

const pages = handler(runtimeBuild, undefined, { getLoadContext: () => new RouterContextProvider() as any })

app.use(
  serveStatic({
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, immutable, max-age=31536000')
    },
    precompressed: true,
    // Assets are emitted under the base path (e.g. /retro/assets/...); strip it for the file lookup.
    rewriteRequestPath: stripBase,
    root: 'dist/client',
  }),
)

// Send the bare origin to the app's base path when hosted under a subpath.
if (baseUrl) {
  app.get('/', (c) => c.redirect(`${baseUrl}/`))
}

// React Router pages are mounted at the root; the configured basename makes the router match the
// base-prefixed paths on both the server and the client.
app.route('', pages)

export default app
