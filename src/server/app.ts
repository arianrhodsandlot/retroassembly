import { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { app as api } from '#@/api/app.ts'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { auth } from '#@/middlewares/auth.ts'
import { globals } from '#@/middlewares/globals.ts'
import { logger } from '#@/middlewares/logger.ts'
import { vendors } from '#@/middlewares/vendors.ts'
import { getBaseUrl } from '#@/utils/server/base-url.ts'

// The Hono API/robots routes are not React Router routes, so they are mounted under the base URL
// explicitly (React Router handles its own pages via the configured basename). '' == site root.
const baseUrl = getBaseUrl()

const app = new Hono()
app.use(contextStorage())
app.use(vendors(), globals(), auth(), logger())
app.route(baseUrl, api)
app.get(`${baseUrl}/robots.txt`, (c) => {
  const allowCrawler = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_ALLOW_CRAWLER === 'true'
  const allow = ['User-agent: *', 'Allow: /'].join('\n')
  const disallow = ['User-agent: *', 'Disallow: /'].join('\n')
  const content = allowCrawler ? allow : disallow
  return c.text(content)
})

export default app
