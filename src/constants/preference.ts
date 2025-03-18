import type { PartialDeep } from 'type-fest'
import type { CoreName } from './core'
import type { PlatformName } from './platform'

export type PlatformSortBy = 'alphabet' | 'popularity' | 'release_date'
export type PlatformSortOrder = 'ascending' | 'descending'

export interface Preference {
  emulator: {
    core: Partial<Record<CoreName, Record<string, string>>>
    keyboardMapping: {
      a: string
      b: string
      down: string
      fastforward: string
      l1: string
      l2: string
      l3: string
      left: string
      pause: string
      r1: string
      r2: string
      r3: string
      rewind: string
      right: string
      select: string
      start: string
      up: string
      x: string
      y: string
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
    /**
    input_player1_a = "x"
    input_player1_b = "z"
    input_player1_down = "down"
    input_player1_l = "q"
    input_player1_left = "left"
    input_player1_r = "w"
    input_player1_right = "right"
    input_player1_select = "rshift"
    input_player1_start = "enter"
    input_player1_up = "up"
    input_player1_x = "s"
    input_player1_y = "a"
     */
    keyboardMapping: {
      a: 'x',
      b: 'z',
      down: 'down',
      fastforward: 'space',
      l1: 'q',
      l2: '',
      l3: '',
      left: 'left',
      pause: 'esc',
      r1: 'w',
      r2: '',
      r3: '',
      rewind: 'r',
      right: 'right',
      select: 'rshift',
      start: 'enter',
      up: 'up',
      x: 's',
      y: 'a',
    },
    platform: {
      arcade: { core: 'fbneo' },
      atari2600: { core: 'stella2014' },
      atari5200: { core: 'a5200' },
      atari7800: { core: 'prosystem' },
      atarilynx: { core: 'mednafen_lynx' },
      fds: { core: 'fceumm' },
      gamegear: { core: 'genesis_plus_gx' },
      gb: { core: 'mgba' },
      gba: { core: 'mgba' },
      gbc: { core: 'mgba' },
      megadrive: { core: 'genesis_plus_gx' },
      nes: { core: 'fceumm' },
      ngp: { core: 'mednafen_ngp' },
      ngpc: { core: 'mednafen_ngp' },
      sega32x: { core: 'picodrive' },
      'sg-1000': { core: 'gearsystem' },
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
}
