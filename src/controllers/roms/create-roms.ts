import path from 'node:path'
import { and, eq, type InferInsertModel } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { DateTime } from 'luxon'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { platformMap, type PlatformName } from '#@/constants/platform.ts'
import { romTable } from '#@/databases/schema.ts'
import { getFilePartialDigest } from '#@/utils/server/file.ts'
import { msleuth } from '#@/utils/server/msleuth.ts'
import { extractRomMetadata, normalizeGameInfo } from '#@/utils/server/rom-metadata.ts'
import { countRoms } from './count-roms.ts'

export async function createRom({ file, md5, platform }: { file: File; md5?: string; platform: PlatformName }) {
  const env = getRunTimeEnv()
  const { currentUser, db, preference, storage, t } = getContext().var
  const { library } = db

  // Shared library only mode (per-user toggle or instance env): uploads are disabled entirely.
  if (preference?.ui?.sharedLibraryOnly) {
    throw new HTTPException(403, { message: 'Uploads are disabled in shared library only mode' })
  }

  const cutoffDate = DateTime.fromISO('2026-01-01')
  let maxRomCount = Number.parseInt(env.RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT, 10) || Infinity
  if (currentUser && 'created_at' in currentUser && typeof currentUser.created_at === 'string') {
    const createdAt = DateTime.fromISO(currentUser.created_at)
    if (createdAt.isValid && createdAt >= cutoffDate) {
      maxRomCount = Number.parseInt(env.RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT_2026, 10) || maxRomCount
    }
  }
  const romCount = await countRoms()
  if (romCount + 1 > maxRomCount) {
    throw new HTTPException(400, {
      message: t('error.exceedMaxRomCount', { maxRomCount }),
    })
  }

  const ext = path.parse(file.name).ext.toLowerCase()
  if (!platformMap[platform].fileExtensions.includes(ext)) {
    throw new HTTPException(400, {
      message: `File extension ${ext} is not supported for platform ${platform}`,
    })
  }

  // Look up game info
  let gameInfo: Record<string, any> = {}
  try {
    const gameInfoList = await msleuth.identify({
      files: [{ md5: md5 || '', name: file.name }],
      platform,
    })
    gameInfo = gameInfoList?.[0] || {}
  } catch (error) {
    console.warn(error)
  }

  normalizeGameInfo(gameInfo)

  // Store file
  const digest = await getFilePartialDigest(file)
  const fileId = path.join('roms', platform, `${digest}${ext}`)
  const fileExists = await storage.head(fileId)
  if (!fileExists) {
    await storage.put(fileId, file)
  }

  const romData: InferInsertModel<typeof romTable> = {
    fileId,
    fileName: file.name,
    ...extractRomMetadata(gameInfo),
    platform,
    userId: currentUser.id,
  }

  // Check for existing ROM with same fileName + platform
  const [existingRom] = await library
    .select()
    .from(romTable)
    .where(
      and(
        eq(romTable.userId, currentUser.id),
        eq(romTable.platform, platform),
        eq(romTable.status, 1),
        eq(romTable.fileName, file.name),
      ),
    )
    .limit(1)

  if (existingRom) {
    const updateData = omit(romData, ['id'])
    const [result] = await library.update(romTable).set(updateData).where(eq(romTable.id, existingRom.id)).returning()
    return result
  }

  const [result] = await library.insert(romTable).values(romData).returning()
  return result
}
