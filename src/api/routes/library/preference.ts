import { Hono } from 'hono'
import { getPreference } from '../../../controllers/get-preference.ts'
import { updatePreference } from '../../../controllers/update-preference.ts'

export const preference = new Hono()
  .get('', async (c) => {
    const result = await getPreference()
    return c.json(result)
  })

  .post('', async (c) => {
    const preference = await c.req.json()
    const result = await updatePreference(preference)
    return c.json(result)
  })
