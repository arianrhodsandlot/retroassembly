import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { addFavorite } from '#@/controllers/favorites/add-favorite.ts'
import { removeFavorite } from '#@/controllers/favorites/remove-favorite.ts'

export const favorites = new Hono()

  .post(
    '',

    zValidator(
      'json',
      z.object({
        romId: z.string().min(1),
      }),
    ),

    async (c) => {
      const { romId } = c.req.valid('json')
      const result = await addFavorite(romId)
      return c.json(result)
    },
  )

  .delete(':romId', async (c) => {
    const romId = c.req.param('romId')
    await removeFavorite(romId)
    return c.json(null)
  })
