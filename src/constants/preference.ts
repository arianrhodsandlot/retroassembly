import type { CoreName } from './core'
import type { PlatformName } from './platform'

export type PlatformSortBy = 'alphabet' | 'popularity' | 'release_date'
export type PlatformSortOrder = 'ascending' | 'descending'

export interface Preference {
  emulator: {
    core: Partial<Record<CoreName, Record<string, string>>>
    platform: Record<PlatformName, { core: CoreName; shader?: string }>
  }
  ui: {
    libraryCoverType: 'boxart'
    platformInfoDisplayType: 0
    platforms: PlatformName[]
    theme: 'rose'
  }
  user: unknown
}

export const defaultPreference: Preference = {
  emulator: {
    core: {
      fceumm: {
        fceumm_turbo_enable: 'Both',
      },
      mgba: {
        mgba_gb_colors: 'DMG Green',
        mgba_skip_bios: 'ON',
      },
    },
    platform: {
      arcade: { core: 'fbneo' },
      atari2600: { core: 'stella2014' },
      atari5200: { core: 'a5200' },
      atari7800: { core: 'prosystem' },
      fds: { core: 'fceumm' },
      gamegear: { core: 'genesis_plus_gx' },
      gb: { core: 'mgba' },
      gba: { core: 'mgba' },
      gbc: { core: 'mgba' },
      megadrive: { core: 'genesis_plus_gx' },
      nes: { core: 'fceumm' },
      ngp: { core: 'mednafen_ngp' },
      ngpc: { core: 'mednafen_ngp' },
      sms: { core: 'genesis_plus_gx' },
      snes: { core: 'snes9x' },
      vb: { core: 'mednafen_vb' },
      wonderswan: { core: 'mednafen_wswan' },
      wonderswancolor: { core: 'mednafen_wswan' },
    },
  },
  ui: {
    libraryCoverType: 'boxart',
    platformInfoDisplayType: 0,
    platforms: ['arcade', 'atari2600', 'gb', 'gba', 'gbc', 'megadrive', 'nes', 'snes'],
    theme: 'rose',
  },
  user: {},
}
