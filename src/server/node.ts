import '../utils/migrate.ts'
import { serveStatic } from '@hono/node-server/serve-static'
import { handler } from 'hono-react-router-adapter/node'
import * as build from '../../dist/server/index.js'
import app from './app.ts'

const pages = handler(build)

app.use(serveStatic({ root: 'dist/client' }))

app.route('', pages)

export default app
