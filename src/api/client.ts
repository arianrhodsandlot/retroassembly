import { attemptAsync, isBrowser } from 'es-toolkit'
import { hc, parseResponse } from 'hono/client'
import { getClientBase } from '#@/utils/client/base-url.ts'
import type { AppType } from './app'

// Prefix the runtime base path (e.g. '/retro') so API calls target <origin><base>/api/v1 when the app
// is hosted under a subpath. The base is read at run time from the page, not baked at build time; see
// utils/client/base-url.ts. getClientBase() is '' at the root.
const baseUrl = isBrowser()
  ? new URL(`${getClientBase()}/`, location.origin).href.replace(/\/$/u, '')
  : 'http://localhost'

export const client = hc<AppType>(baseUrl, {
  async fetch(...args: Parameters<typeof fetch>) {
    const response = await fetch(...args)
    if (response.ok) {
      return response
    }
    const [, json] = await attemptAsync(() => response.json())
    throw json ?? response
  },
}).api.v1
export type { InferRequestType, InferResponseType } from 'hono'
export { parseResponse }
