import type { PartialDeep } from 'type-fest'
import { mergePreference } from '../controllers/utils.ts'
import type { CoreName } from './core'
import type { PlatformName } from './platform'

export type PlatformSortBy = 'alphabet' | 'popularity' | 'release_date'
export type PlatformSortOrder = 'ascending' | 'descending'

export interface Preference {
  emulator: {
    core: Partial<Record<CoreName, Record<string, string>>>
    gamepadMappings: Record<
      string,
      {
        $fast_forward: string
        $pause: string
        $rewind: string
        input_player1_a_btn: string
        input_player1_b_btn: string
        input_player1_down_btn: string
        input_player1_l1_btn: string
        input_player1_l2_btn: string
        input_player1_l3_btn: string
        input_player1_left_btn: string
        input_player1_r1_btn: string
        input_player1_r2_btn: string
        input_player1_r3_btn: string
        input_player1_right_btn: string
        input_player1_select_btn: string
        input_player1_start_btn: string
        input_player1_up_btn: string
        input_player1_x_btn: string
        input_player1_y_btn: string
      }
    >
    keyboardMapping: {
      $pause: string
      input_hold_fast_forward: string
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
      input_rewind: string
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
    gamepadMappings: {},
    keyboardMapping: {
      $pause: 'esc',
      input_hold_fast_forward: 'space',
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
      input_rewind: 'r',
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

export function resolveUserPreference(userPreference: PreferenceSnippet) {
  const fallbackPreference = structuredClone(defaultPreference)

  const userKeyboardMapping = userPreference.emulator?.keyboardMapping

  // remove conflicting keys from default preference according to user preference
  // const fallbackKeyboardMapping = fallbackPreference.emulator.keyboardMapping
  // const userKeys = Object.values(userKeyboardMapping)
  // for (const key in fallbackKeyboardMapping) {
  //   const value = fallbackKeyboardMapping[key]
  //   if (userKeys.includes(value)) {
  //     delete fallbackKeyboardMapping[key]
  //   }
  // }

  if (userKeyboardMapping && 'keyboardMapping' in fallbackPreference.emulator) {
    // @ts-expect-error force delete this field
    fallbackPreference.emulator.keyboardMapping = undefined
  }

  return mergePreference(fallbackPreference, userPreference)
}
