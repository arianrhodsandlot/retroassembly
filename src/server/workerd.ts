import { Hono } from 'hono'
import { createRequestHandler } from 'react-router'
import app from './app.ts'

const pages = new Hono()
const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)
pages.all('*', (c) => requestHandler(c.req.raw, { cloudflare: { ctx: c.executionCtx, env: c.env } }))

app.route('', pages)

export default app
