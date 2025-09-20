import { attemptAsync } from 'es-toolkit'
import { hc, parseResponse } from 'hono/client'
import type { AppType } from './app'

const baseUrl = '/'

export const client = hc<AppType>(baseUrl, {
  async fetch(input, init) {
    const response = await fetch(input, init)
    if (response.ok) {
      return response
    }
    const [, json] = await attemptAsync(() => response.json())
    throw json ?? response
  },
}).api.v1
export type { InferRequestType } from 'hono'
export { parseResponse }
