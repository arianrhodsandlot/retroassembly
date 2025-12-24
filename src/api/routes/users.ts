import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { createUser } from '#@/controllers/users/create-user.ts'
import { deleteUser } from '#@/controllers/users/delete-user.ts'
import { getAllUsers } from '#@/controllers/users/get-all-users.ts'

export const users = new Hono()

  .get('', async (c) => {
    const users = await getAllUsers()
    return c.json(users)
  })

  .post(
    '',
    zValidator(
      'form',
      z.object({
        password: z.string(),
        username: z.string(),
      }),
    ),
    async (c) => {
      const form = c.req.valid('form')
      const user = await createUser(form)
      return c.json(user)
    },
  )

  .delete(':id', async (c) => {
    await deleteUser(c.req.param('id'))
    return c.json({ success: true })
  })
