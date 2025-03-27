import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { getContextData } from 'waku/middleware/context'
import { addRoutes } from './routes.ts'

export function createApp() {
  const app = new Hono().basePath('/api/v1')

  const authMiddleware = createMiddleware(async (c, next) => {
    const { currentUser } = getContextData()
    if (!currentUser) {
      return c.json({ message: 'need auth' }, 400)
    }
    return await next()
  })

  app.use(authMiddleware)

  addRoutes(app)

  return app
}
