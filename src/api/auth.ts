import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { z } from 'zod'
import { createSession } from '../controllers/create-session.ts'
import { createUser } from '../controllers/create-user.ts'
import { updatePassword } from '../controllers/update-password.ts'

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
    const cookie = { expires: session.expiresAt, httpOnly: true, path: '/', sameSite: 'Strict', secure: false } as const
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
    const cookie = { expires: session.expiresAt, httpOnly: true, path: '/', sameSite: 'Strict', secure: false } as const
    setCookie(c, 'token', session.token, cookie)
    return c.json({ session, user })
  },
)

app.patch(
  'password',

  zValidator(
    'form',
    z.object({
      new_password: z.string(),
      password: z.string(),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')
    await updatePassword(form.password, form.new_password)
    return c.json(true)
  },
)
