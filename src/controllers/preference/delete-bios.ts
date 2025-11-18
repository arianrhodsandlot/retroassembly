import { getContext } from 'hono/context-storage'
import type { PlatformName } from '#@/constants/platform.ts'
import { updatePreference } from './update-preference.ts'

export async function deleteBIOS(platform: PlatformName, fileName: string) {
  const { preference } = getContext().var

  const { bioses = [] } = preference.emulator.platform[platform]

  return await updatePreference({
    emulator: {
      platform: {
        [platform]: {
          bioses: bioses.filter((bios) => bios.fileName !== fileName),
        },
      },
    },
  })
}
