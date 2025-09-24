import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { createLaunchRecord } from '@/controllers/launch-records/create-launch-record.ts'
import { getLaunchRecords } from '@/controllers/launch-records/get-launch-records.ts'

export const launchRecords = new Hono()

  .post(
    '',

    zValidator(
      'form',
      z.object({
        core: z.string(),
        rom: z.string(),
      }),
    ),

    async (c) => {
      const form = c.req.valid('form')
      await createLaunchRecord(form)
      return c.json(null)
    },
  )

  .get(
    '',

    zValidator(
      'query',
      z.object({
        page: z.coerce.number().default(1),
        page_size: z.coerce.number().default(100),
      }),
    ),

    async (c) => {
      const query = c.req.valid('query')
      const result = await getLaunchRecords(query)
      return c.json(result)
    },
  )
