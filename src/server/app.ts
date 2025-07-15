import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { app as api } from '../api/app.ts'
import { auth } from '../middlewares/hono/auth.ts'
import { globals } from '../middlewares/hono/globals.ts'
import { logger } from '../middlewares/hono/logger.ts'
import { vendors } from '../middlewares/hono/vendors.ts'

const app = new Hono()
app.use(contextStorage())
app.use(vendors(), globals(), auth(), logger())
app.route('api', api)

export default app
