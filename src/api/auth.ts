import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { z } from 'zod'
import { createSession } from '../controllers/create-session.ts'
import { createUser } from '../controllers/create-user.ts'

export const app = new Hono().basePath('auth')

app.post(
  'login',

  zValidator(
    'form',
    z.object({
      password: z.string(),
      username: z.string(),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')
    const { session, user } = await createSession(form)
    const cookie = { expires: session.expiresAt, httpOnly: true, path: '/', sameSite: 'Strict', secure: true } as const
    setCookie(c, 'token', session.token, cookie)
    return c.json({ session, user })
  },
)

app.post(
  'register',

  zValidator(
    'form',
    z.object({
      password: z.string(),
      username: z.string(),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')
    await createUser(form)
    const { session, user } = await createSession(form)
    const cookie = { expires: session.expiresAt, httpOnly: true, path: '/', sameSite: 'Strict', secure: true } as const
    setCookie(c, 'token', session.token, cookie)
    return c.json({ session, user })
  },
)
