import { Hono } from 'hono'
import { createRequestHandler } from 'react-router'
import { authMiddleware } from '@/middlewares/hono/auth.ts'

export const app = new Hono()
app.use(authMiddleware)
const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)
app.all('/*', (c) => requestHandler(c.req.raw, { cloudflare: { ctx: c.executionCtx, env: c.env } }))
