import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import z from 'zod'
import type { PlatformName } from '@/constants/platform.ts'
import { addBIOS } from '@/controllers/preference/add-bios.ts'
import { deleteBIOS } from '@/controllers/preference/delete-bios.ts'
import { getPreference } from '@/controllers/preference/get-preference.ts'
import { updatePreference } from '@/controllers/preference/update-preference.ts'

export const preference = new Hono()
  .get('', async (c) => {
    const result = await getPreference()
    return c.json(result)
  })

  .post(
    '',

    zValidator('json', z.unknown()),

    async (c) => {
      const preference = await c.req.json()
      const result = await updatePreference(preference)
      return c.json(result)
    },
  )

  .post(
    'bioses',

    zValidator(
      'form',
      z.object({
        file: z.instanceof(File),
        platform: z.string<PlatformName>(),
      }),
    ),

    async (c) => {
      const { file, platform } = c.req.valid('form')
      const result = await addBIOS(platform, file)
      return c.json(result)
    },
  )

  .delete(
    'bioses',

    zValidator(
      'query',
      z.object({
        file_name: z.string(),
        platform: z.string<PlatformName>(),
      }),
    ),

    async (c) => {
      const { file_name: fileName, platform } = c.req.valid('query')
      const result = await deleteBIOS(platform, fileName)
      return c.json(result)
    },
  )
