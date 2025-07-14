import { Hono } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
import { contextStorage } from 'hono/context-storage'
import { requestId } from 'hono/request-id'
import { pinoLogger } from 'hono-pino'
import { app as api } from '../api/app.ts'
import { auth } from '../middlewares/hono/auth.ts'
import { globals } from '../middlewares/hono/globals.ts'
import { vendors } from '../middlewares/hono/vendors.ts'

const app = new Hono()
app.use(
  requestId(),
  contextStorage(),
  pinoLogger(getRuntimeKey() === 'node' ? { pino: { transport: { target: 'hono-pino/debug-log' } } } : {}),
)
app.use(vendors(), globals(), auth())
app.route('api', api)

export default app
