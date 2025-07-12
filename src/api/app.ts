import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { app as auth } from './auth.ts'
import { app as library } from './library.ts'

export const app = new Hono().basePath('v1')
app.route('', auth)
app.route('', library)

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  console.error(error)
  return c.json({ message: error.message || 'Unknown error' }, 500)
})
