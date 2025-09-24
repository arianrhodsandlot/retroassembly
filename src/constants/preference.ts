import { mergePreference } from '../utils/isomorphic/preference.ts'
import type { CoreName } from './core'
import type { PlatformName } from './platform'

export type PlatformSortBy = 'alphabet' | 'popularity' | 'release_date'
export type PlatformSortOrder = 'ascending' | 'descending'

export interface Preference {
  emulator: {
    core: Partial<Record<CoreName, Record<string, string>>>
    fullscreen: boolean
    platform: Record<PlatformName, { bioses: { fileId: string; fileName: string }[]; core: CoreName }>
    shader: string
    videoSmooth: boolean
  }
  input: {
    confirmButtonStyle: string
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
  }
  ui: {
    libraryCoverSize: string
    libraryCoverType: 'boxart'
    platforms: PlatformName[]
    showDistrictOnTitle: boolean
    showFocusIndicators: string
    showSidebar: boolean
    showTitle: boolean
  }
}

export interface ResolvedPreference extends Preference {
  emulator: NonNullable<Preference['emulator']>
  input: {
    confirmButtonStyle: NonNullable<Preference['input']>['confirmButtonStyle']
    gamepadMappings: NonNullable<NonNullable<Preference['input']>['gamepadMappings']>
    keyboardMapping: NonNullable<NonNullable<Preference['input']>['keyboardMapping']>
  }
  ui: NonNullable<Preference['ui']>
}

type PartialDeepNullable<T> = {
  [K in keyof T]?: T[K] extends readonly (infer U)[]
    ? null | readonly PartialDeepNullable<U>[]
    : T[K] extends (infer U)[]
      ? null | PartialDeepNullable<U>[]
      : T[K] extends Record<string, any>
        ? null | PartialDeepNullable<T[K]>
        : null | T[K]
}

export type PreferenceSnippet = PartialDeepNullable<Preference>

export const defaultPreference: ResolvedPreference = {
  emulator: {
    core: {
      fceumm: {
        fceumm_turbo_enable: 'Both',
      },
      mame2003_plus: {
        'mame2003-plus_skip_disclaimer': 'enabled',
      },
      mgba: {
        mgba_gb_colors: 'DMG Green',
        mgba_skip_bios: 'ON',
      },
    },
    fullscreen: false,
    platform: {
      arcade: { bioses: [], core: 'mame2003_plus' },
      atari2600: { bioses: [], core: 'stella2014' },
      atari5200: { bioses: [], core: 'a5200' },
      atari7800: { bioses: [], core: 'prosystem' },
      atarilynx: { bioses: [], core: 'mednafen_lynx' },
      famicom: { bioses: [], core: 'fceumm' },
      fds: { bioses: [], core: 'fceumm' },
      gamegear: { bioses: [], core: 'genesis_plus_gx' },
      gb: { bioses: [], core: 'mgba' },
      gba: { bioses: [], core: 'mgba' },
      gbc: { bioses: [], core: 'mgba' },
      genesis: { bioses: [], core: 'genesis_plus_gx' },
      megadrive: { bioses: [], core: 'genesis_plus_gx' },
      nes: { bioses: [], core: 'fceumm' },
      ngp: { bioses: [], core: 'mednafen_ngp' },
      ngpc: { bioses: [], core: 'mednafen_ngp' },
      sega32x: { bioses: [], core: 'picodrive' },
      sfc: { bioses: [], core: 'snes9x' },
      'sg-1000': { bioses: [], core: 'gearsystem' },
      sms: { bioses: [], core: 'genesis_plus_gx' },
      snes: { bioses: [], core: 'snes9x' },
      vb: { bioses: [], core: 'mednafen_vb' },
      wonderswan: { bioses: [], core: 'mednafen_wswan' },
      wonderswancolor: { bioses: [], core: 'mednafen_wswan' },
    },
    shader: '',
    videoSmooth: false,
  },
  input: {
    confirmButtonStyle: 'nintendo',
    gamepadMappings: {},
    keyboardMapping: {
      $pause: 'escape',
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
  },
  ui: {
    libraryCoverSize: 'medium',
    libraryCoverType: 'boxart',
    platforms: ['arcade', 'atari2600', 'gb', 'gba', 'gbc', 'genesis', 'nes', 'snes'],
    showDistrictOnTitle: false,
    showFocusIndicators: 'auto',
    showSidebar: true,
    showTitle: true,
  },
}

export function resolveUserPreference(rawUserPreference: null | PreferenceSnippet) {
  const userPreference = structuredClone(rawUserPreference) || {}
  for (const key of ['emulator', 'ui', 'input'] as const) {
    userPreference[key] ||= {}
  }
  const fallbackPreference = structuredClone(defaultPreference)

  const userKeyboardMapping = userPreference.input?.keyboardMapping

  if (userKeyboardMapping && fallbackPreference.input && 'keyboardMapping' in fallbackPreference.input) {
    // @ts-expect-error force delete this field
    fallbackPreference.input.keyboardMapping = undefined
  }

  // a temporary fix. there should be a better way to handle this
  if (userPreference.ui && !userPreference.ui?.platforms) {
    delete userPreference.ui.platforms
  }

  return mergePreference(fallbackPreference, userPreference) as Preference
}
