import path from 'node:path'
import { getContext } from 'hono/context-storage'
import type { PlatformName } from '#@/constants/platform.ts'
import { getFilePartialDigest } from '#@/utils/server/file.ts'
import { updatePreference } from './update-preference.ts'

export async function addBIOS(platform: PlatformName, file: File) {
  const digest = await getFilePartialDigest(file)
  const { preference, storage } = getContext().var
  const { ext } = path.parse(file.name)
  const fileId = path.join('bioses', platform, `${digest}${ext}`)
  const fileExists = await storage.head(fileId)
  if (!fileExists) {
    await storage.put(fileId, file)
  }

  const { bioses } = preference.emulator.platform[platform]
  const bios = bioses.find((bios) => bios.fileName === file.name)
  if (bios) {
    bios.fileId = fileId
  } else {
    bioses.push({ fileId, fileName: file.name })
  }

  return await updatePreference({
    emulator: {
      platform: {
        [platform]: {
          bioses,
        },
      },
    },
  })
}
