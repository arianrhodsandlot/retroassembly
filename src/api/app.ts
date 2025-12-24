import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { app as auth } from './routes/auth.ts'
import { app as library } from './routes/library/library.ts'
import { users } from './routes/users.ts'

export const app = new Hono()
  .basePath('api/v1')
  .route('auth', auth)
  .route('users', users)
  .route('', library)

  .onError((error, c) => {
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status)
    }
    console.error(error)
    return c.json({ message: error.message || 'Unknown error' }, 500)
  })

export type AppType = typeof app
