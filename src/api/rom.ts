import { and, desc, eq } from 'drizzle-orm'
import { isString } from 'es-toolkit'
import { getContextData } from 'waku/middleware/context'
import { platformMap } from '../constants/platform.ts'
import { createRom } from '../controllers/create-rom.ts'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { rom, state } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'
import { app } from './app.ts'
import { getFileResponse } from './utils/storage.ts'

function isBlobs(value: unknown): value is File[] {
  return Array.isArray(value) && value.every((item) => item instanceof File)
}

app.get('rom/test', async (c) => {
  const platform = c.req.query('platform') || ''
  const name = c.req.query('name') || ''

  const result = await guessGameInfo(name, platform)

  return c.json(result)
})

app.put('rom/new', async (c) => {
  // validations
  const body = await c.req.parseBody({ all: true })
  const { platform } = body
  if (!isString(platform) || !(platform in platformMap)) {
    return c.json({ message: 'invalid platform' })
  }
  const files = Array.isArray(body.files) ? body.files : [body.files]
  if (!isBlobs(files)) {
    return c.json({ message: 'invalid files' })
  }

  const { storage } = getContextData()

  const roms = await Promise.all(
    files.map(async (file) => {
      const { launchbox, libretro } = await guessGameInfo(file.name, platform)
      const fileId = nanoid()
      await storage.put(fileId, file)
      const rom = await createRom({
        fileId,
        fileName: file.name,
        launchboxGameId: launchbox?.database_id,
        libretroGameId: libretro?.id,
        platform,
      })
      return rom
    }),
  )

  return c.json(roms)
})

app.get('rom/:id/content', async (c) => {
  const { currentUser, db } = getContextData()

  const [result] = await db.library
    .select()
    .from(rom)
    .where(and(eq(rom.id, c.req.param('id')), eq(rom.user_id, currentUser.id)))
    .limit(1)
  if (!result) {
    return c.body('rom not found', 404)
  }

  return getFileResponse(result.file_id, c)
})

app.get('rom/:id/states', async (c) => {
  const romId = c.req.param('id')
  const type = c.req.query('type')
  const { currentUser, db } = getContextData()

  const conditions = [eq(state.user_id, currentUser.id), eq(state.status, 1)]
  if (romId) {
    conditions.push(eq(state.rom_id, romId))
  }
  if (type === 'auto' || type === 'manual') {
    conditions.push(eq(state.type, type))
  }
  const where = and(...conditions)
  const results = await db.library.select().from(state).where(where).orderBy(desc(state.created_at))
  return c.json(results)
})
