import type { Hono } from 'hono'
import type { Config } from 'waku/config'
import { cloudflareDevServer } from './cloudflare-dev-server.ts'

type Enhancer = NonNullable<Config['unstable_honoEnhancer']>

export const enhance = function enhance(createApp: (app: Hono) => Hono) {
  return (appToCreate: Hono) => {
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
    }
  }
} as Enhancer
