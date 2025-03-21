import type { PartialDeep } from 'type-fest'
import type { CoreName } from './core'
import type { PlatformName } from './platform'

export type PlatformSortBy = 'alphabet' | 'popularity' | 'release_date'
export type PlatformSortOrder = 'ascending' | 'descending'

export interface Preference {
  emulator: {
    core: Partial<Record<CoreName, Record<string, string>>>
    keyboardMapping: {
      fastforward: string
      input_player1_a: string
      input_player1_b: string
      input_player1_down: string
      input_player1_l1: string
      input_player1_l2: string
      input_player1_l3: string
      input_player1_left: string
      input_player1_r1: string
      input_player1_r2: string
      input_player1_r3: string
      input_player1_right: string
      input_player1_select: string
      input_player1_start: string
      input_player1_up: string
      input_player1_x: string
      input_player1_y: string
      pause: string
      rewind: string
    }
    platform: Record<PlatformName, { core: CoreName }>
    shader: string
  }
  ui: {
    libraryCoverType: 'boxart'
    platformInfoDisplayType: 0
    platforms: PlatformName[]
    theme: 'rose'
  }
}

export type PreferenceSnippet = PartialDeep<Preference>

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
    keyboardMapping: {
      fastforward: 'space',
      input_player1_a: 'x',
      input_player1_b: 'z',
      input_player1_down: 'down',
      input_player1_l1: 'q',
      input_player1_l2: '',
      input_player1_l3: '',
      input_player1_left: 'left',
      input_player1_r1: 'w',
      input_player1_r2: '',
      input_player1_r3: '',
      input_player1_right: 'right',
      input_player1_select: 'rshift',
      input_player1_start: 'enter',
      input_player1_up: 'up',
      input_player1_x: 's',
      input_player1_y: 'a',
      pause: 'esc',
      rewind: 'r',
    },
    platform: {
      arcade: { core: 'fbneo' },
      atari2600: { core: 'stella2014' },
      atari5200: { core: 'a5200' },
      atari7800: { core: 'prosystem' },
      atarilynx: { core: 'mednafen_lynx' },
      famicom: { core: 'fceumm' },
      fds: { core: 'fceumm' },
      gamegear: { core: 'genesis_plus_gx' },
      gb: { core: 'mgba' },
      gba: { core: 'mgba' },
      gbc: { core: 'mgba' },
      genesis: { core: 'genesis_plus_gx' },
      megadrive: { core: 'genesis_plus_gx' },
      nes: { core: 'fceumm' },
      ngp: { core: 'mednafen_ngp' },
      ngpc: { core: 'mednafen_ngp' },
      sega32x: { core: 'picodrive' },
      sfc: { core: 'snes9x' },
      'sg-1000': { core: 'gearsystem' },
      sms: { core: 'genesis_plus_gx' },
      snes: { core: 'snes9x' },
      vb: { core: 'mednafen_vb' },
      wonderswan: { core: 'mednafen_wswan' },
      wonderswancolor: { core: 'mednafen_wswan' },
    },
    shader: '',
  },
  ui: {
    libraryCoverType: 'boxart',
    platformInfoDisplayType: 0,
    platforms: ['arcade', 'atari2600', 'gb', 'gba', 'gbc', 'genesis', 'nes', 'snes'],
    theme: 'rose',
  },
}
