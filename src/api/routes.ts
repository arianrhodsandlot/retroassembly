import { zValidator } from '@hono/zod-validator'
import type { Hono } from 'hono'
import { z } from 'zod'
import { createLaunchRecord } from '@/controllers/create-launch-record.ts'
import { deleteLaunchRecord } from '@/controllers/delete-launch-record.ts'
import { deleteRom } from '@/controllers/delete-rom.ts'
import { getLaunchRecords } from '@/controllers/get-launch-records.ts'
import { createRoms } from '../controllers/create-roms.ts'
import { createState } from '../controllers/create-state.ts'
import { getRomContent } from '../controllers/get-rom-content.ts'
import { getStateContent } from '../controllers/get-state-content.ts'
import { getStates } from '../controllers/get-states.ts'
import { createFileResponse } from './utils.ts'

// eslint-disable-next-line max-lines-per-function
export function addRoutes(app: Hono) {
  app.put(
    'rom/new',

    zValidator(
      'form',
      z.object({
        'files[]': z.instanceof(File).array().max(10),
        platform: z.string(),
      }),
    ),

    async (c) => {
      const form = c.req.valid('form')
      const roms = await createRoms({ files: form['files[]'], platform: form.platform })
      return c.json(roms)
    },
  )

  app.get('rom/:id/content', async (c) => {
    const object = await getRomContent(c.req.param('id'))
    if (object) {
      return createFileResponse(object)
    }
  })

  app.get(
    'rom/:id/states',

    zValidator(
      'query',
      z.object({
        type: z.enum(['auto', 'manual']).optional(),
      }),
    ),

    async (c) => {
      const query = c.req.valid('query')
      const rom = c.req.param('id')
      const states = await getStates({ rom, type: query.type })
      return c.json(states)
    },
  )

  app.delete(
    'rom/:id/launch_records',

    async (c) => {
      const rom = c.req.param('id')
      await deleteLaunchRecord({ rom })
      return c.json(null)
    },
  )

  app.delete('rom/:id', async (c) => {
    await deleteRom(c.req.param('id'))
    return c.json(null)
  })

  app.get(
    'states',

    zValidator(
      'query',
      z.object({
        rom: z.string(),
        type: z.enum(['manual', 'auto']),
      }),
    ),

    async (c) => {
      const query = c.req.valid('query')
      const states = await getStates({ rom: query.rom, type: query.type })
      return c.json(states)
    },
  )

  app.put(
    'state/new',

    zValidator(
      'form',
      z.object({
        core: z.string(),
        rom: z.string(),
        state: z.instanceof(File),
        thumbnail: z.instanceof(File),
        type: z.enum(['auto', 'manual']),
      }),
    ),

    async (c) => {
      const form = c.req.valid('form')
      const state = await createState(form)
      return c.json(state)
    },
  )

  app.get('state/:id/content', async (c) => {
    const state = await getStateContent(c.req.param('id'))
    if (state) {
      return createFileResponse(state)
    }
  })

  app.get('state/:id/thumbnail', async (c) => {
    const file = await getStateContent(c.req.param('id'), 'thumbnail')
    if (file) {
      return createFileResponse(file)
    }
  })

  app.post(
    'launch_record/new',

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

  app.get(
    'launch_records',

    zValidator(
      'query',
      z.object({
        page: z.number().default(1),
        page_size: z.number().default(50),
      }),
    ),

    async (c) => {
      const query = c.req.valid('query')
      const result = await getLaunchRecords(query)
      return c.json(result)
    },
  )
}
