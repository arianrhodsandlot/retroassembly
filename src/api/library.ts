import assert from 'node:assert'
import path from 'node:path'
import { zValidator } from '@hono/zod-validator'
import { pull } from 'es-toolkit'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { z } from 'zod'
import { getRunTimeEnv } from '@/constants/env.ts'
import { getRom } from '@/controllers/get-rom.ts'
import { updateRom } from '@/controllers/update-rom.ts'
import { stringToUTCDateTime } from '@/utils/date.ts'
import { nanoid } from '@/utils/misc.ts'
import { createLaunchRecord } from '../controllers/create-launch-record.ts'
import { createRoms } from '../controllers/create-roms.ts'
import { createState } from '../controllers/create-state.ts'
import { deleteLaunchRecord } from '../controllers/delete-launch-record.ts'
import { deleteRom } from '../controllers/delete-rom.ts'
import { getFileContent } from '../controllers/get-file-content.ts'
import { getLaunchRecords } from '../controllers/get-launch-records.ts'
import { getPreference } from '../controllers/get-preference.ts'
import { getRomContent } from '../controllers/get-rom-content.ts'
import { getStateContent } from '../controllers/get-state-content.ts'
import { getStates } from '../controllers/get-states.ts'
import { updatePreference } from '../controllers/update-preference.ts'
import { createFileResponse } from './utils.ts'

interface Bindings {
  RETROASSEMBLY_RUN_TIME_STORAGE_HOST?: string
}

export const app = new Hono<{ Bindings: Bindings }>()

const authMiddleware = createMiddleware(async (c, next) => {
  const { unauthorized } = c.var
  if (unauthorized) {
    return c.json({ message: 'Unauthorized' }, 400)
  }
  return await next()
})

app.use(authMiddleware)

app.post(
  'roms',

  zValidator(
    'form',
    z.object({
      'files[]': z.instanceof(File).array().max(10),
      md5s: z.string().optional(),
      platform: z.string(),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')
    let md5s = []
    if (form.md5s) {
      try {
        md5s = JSON.parse(form.md5s)
      } catch {}
    }
    const roms = await createRoms({ files: form['files[]'], md5s, platform: form.platform })
    return c.json(roms)
  },
)

app.patch(
  'roms/:id',

  zValidator(
    'form',
    z.object({
      gameBoxartFileIds: z.string().optional(),
      gameDescription: z.string().optional(),
      gameDeveloper: z.string().optional(),
      gameGenres: z.string().optional(),
      gameName: z.string().optional(),
      gamePlayers: z.string().optional(),
      gamePublisher: z.string().optional(),
      gameRating: z.string().optional(),
      gameReleaseDate: z.string().optional(),
      gameThumbnailFileIds: z.string().optional(),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')
    const id = c.req.param('id')
    const rom = {
      ...form,
      gamePlayers: form.gamePlayers ? Number.parseInt(form.gamePlayers, 10) : 0,
      gameReleaseDate: stringToUTCDateTime(form.gameReleaseDate)?.toJSDate(),
    }
    for (const key in rom) {
      if (!rom[key]) {
        rom[key] = null
      }
    }
    const ret = await updateRom({ id, ...rom })
    return c.json(ret)
  },
)

app.post(
  'roms/:id/boxart',

  zValidator(
    'form',
    z.object({
      file: z.instanceof(File),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')

    const { currentUser, storage } = c.var
    assert.ok(currentUser)
    const id = c.req.param('id')
    const rom = await getRom({ id })
    assert.ok(rom)

    const extname = path.extname(form.file.name)
    const fileId = path.join('attachments', currentUser.id, rom.platform, rom.id, `${nanoid()}${extname}`)
    await storage.put(fileId, form.file)
    const updatedRom = await updateRom({ gameBoxartFileIds: fileId, id })
    return c.json(updatedRom.gameBoxartFileIds)
  },
)

app.delete(
  'roms/:id/boxart',

  async (c) => {
    await updateRom({ gameBoxartFileIds: null, id: c.req.param('id') })
    return c.json(null)
  },
)

app.post(
  'roms/:id/thumbnail',

  zValidator(
    'form',
    z.object({
      file: z.instanceof(File),
    }),
  ),

  async (c) => {
    const form = c.req.valid('form')

    const { currentUser, storage } = c.var
    assert.ok(currentUser)
    const id = c.req.param('id')
    const rom = await getRom({ id })
    assert.ok(rom)

    const gameThumbnailFileIds: string[] = rom.gameThumbnailFileIds?.split(',') || []
    const extname = path.extname(form.file.name)
    const fileId = path.join('attachments', currentUser.id, rom.platform, rom.id, `${nanoid()}${extname}`)
    await storage.put(fileId, form.file)
    gameThumbnailFileIds.push(fileId)
    const updatedRom = await updateRom({ gameThumbnailFileIds: gameThumbnailFileIds.join(','), id })
    return c.json(updatedRom.gameThumbnailFileIds)
  },
)

app.delete(
  'roms/:id/thumbnail/:thumbnailId',

  async (c) => {
    const { currentUser } = c.var
    assert.ok(currentUser)
    const id = c.req.param('id')
    const thumbnailId = c.req.param('thumbnailId')
    const rom = await getRom({ id })
    assert.ok(rom)
    const gameThumbnailFileIds: string[] = rom.gameThumbnailFileIds?.split(',') || []
    pull(gameThumbnailFileIds, [thumbnailId])
    const updatedRom = await updateRom({
      gameThumbnailFileIds: gameThumbnailFileIds.length > 0 ? gameThumbnailFileIds.join(',') : null,
      id,
    })
    return c.json(updatedRom.gameThumbnailFileIds)
  },
)

app.get('roms/:id/content', async (c) => {
  const object = await getRomContent(c.req.param('id'))
  if (object) {
    return createFileResponse(object)
  }
})

app.get(
  'roms/:id/states',

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
  'roms/:id/launch_records',

  async (c) => {
    const rom = c.req.param('id')
    await deleteLaunchRecord({ rom })
    return c.json(null)
  },
)

app.delete('roms/:id', async (c) => {
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

app.post(
  'states',

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

app.get('files/:id', async (c) => {
  const id = c.req.param('id')
  const runTimeEnv = getRunTimeEnv()
  if (runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST) {
    return c.redirect(new URL(id, runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST))
  }
  const file = await getFileContent(id)
  if (file) {
    return createFileResponse(file)
  }
})

app.post(
  'launch_records',

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

app.get('preference', async (c) => {
  const result = await getPreference()
  return c.json(result)
})

app.post('preference', async (c) => {
  const preference = await c.req.json()
  const result = await updatePreference(preference)
  return c.json(result)
})
