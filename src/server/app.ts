import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { logger } from 'hono/logger'
import { app as api } from '../api/app.ts'
import { auth } from '../middlewares/hono/auth.ts'
import { globals } from '../middlewares/hono/globals.ts'
import { vendors } from '../middlewares/hono/vendors.ts'

const app = new Hono()
app.use(contextStorage(), logger(), vendors(), globals(), auth())

app.route('api', api)

export default app
