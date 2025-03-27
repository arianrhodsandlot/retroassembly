import type { Hono } from 'hono'
import { logger } from 'hono/logger'
import type { Config } from 'waku/config'
import { cloudflareDevServer } from './cloudflare-dev-server.ts'

type Enhancer = NonNullable<Config['unstable_honoEnhancer']>

const loggerMiddleware = logger()
const logRoutes = ['/', '/library/*', '/api/*', '/RSC/*']
export const enhance = function enhance(createApp: (app: Hono) => Hono) {
  return (appToCreate: Hono) => {
    for (const route of logRoutes) {
      appToCreate.use(route, loggerMiddleware)
    }
    const app = createApp(appToCreate)
    const devHandler = cloudflareDevServer({
      // Optional config settings for the Cloudflare dev server (wrangler proxy)
      // https://developers.cloudflare.com/workers/wrangler/api/#parameters-1
      persist: {
        path: '.wrangler/state/v3',
      },
    })
    return {
      fetch: (req: Request) => {
        return devHandler(req, app)
      },
      hostname: '0.0.0.0',
    }
  }
} as Enhancer
