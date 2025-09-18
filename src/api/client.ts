import { hc, parseResponse } from 'hono/client'
import type { AppType } from './app'

const baseUrl = '/'

export const client = hc<AppType>(baseUrl).api.v1
export type { InferRequestType } from 'hono'
export { parseResponse }
