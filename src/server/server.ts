import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { app as api } from '../api/app.ts'
import { globalsMiddleware } from '../middlewares/hono/globals.ts'
import { app as pages } from '../pages/app.ts'

const app = new Hono()
app.use(contextStorage(), logger(), globalsMiddleware)

app.route('/api', api)
app.route('/', pages)

export default app
