import '../utils/server/migration/initalization.ts'
import '../utils/server/migration/raw-metadata.ts'
import { serveStatic } from '@hono/node-server/serve-static'
import { handler } from 'hono-react-router-adapter/node'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we can not guarantee that this file exists
import * as build from '../../dist/server/index.js'
import app from './app.ts'

const pages = handler(build)

app.use(
  serveStatic({
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, immutable, max-age=31536000')
    },
    precompressed: true,
    root: 'dist/client',
  }),
)

app.route('', pages)

export default app
