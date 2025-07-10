import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { app as api } from '../api/app.ts'
import { authMiddleware } from '../middlewares/hono/auth.ts'
import { globalsMiddleware } from '../middlewares/hono/globals.ts'

const app = new Hono()
app.use(contextStorage(), logger(), globalsMiddleware, authMiddleware)

app.route('/api', api)

export default app
