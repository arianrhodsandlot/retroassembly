import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { app as api } from '../api/app.ts'
import { getRunTimeEnv } from '../constants/env.ts'
import { auth } from '../middlewares/hono/auth.ts'
import { globals } from '../middlewares/hono/globals.ts'
import { logger } from '../middlewares/hono/logger.ts'
import { vendors } from '../middlewares/hono/vendors.ts'

const app = new Hono()
app.use(contextStorage())
app.use(vendors(), globals(), auth(), logger())
app.route('', api)
app.get('/robots.txt', (c) => {
  const allowCrawler = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_ALLOW_CRAWLER === 'true'
  const allow = ['User-agent: *', 'Allow: /'].join('\n')
  const disallow = ['User-agent: *', 'Disallow: /'].join('\n')
  const content = allowCrawler ? allow : disallow
  return c.text(content)
})

export default app
