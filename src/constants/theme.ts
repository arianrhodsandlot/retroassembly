// Radix UI supported accent colors
export const accentColors = [
  'red',
  'blue',
  'green',
  'orange',
  'purple',
  'pink',
  'cyan',
  'teal',
  'amber',
  'indigo',
] as const

export type AccentColor = (typeof accentColors)[number]

// Light/dark appearance modes
export const appearanceModes = ['system', 'light', 'dark'] as const

export type AppearanceMode = (typeof appearanceModes)[number]

// Theme configuration
export interface ThemeConfig {
  accentColor: AccentColor
  appearanceMode: AppearanceMode
}

export const defaultThemeConfig: ThemeConfig = {
  accentColor: 'red',
  appearanceMode: 'system',
}

// Theme definitions with display info
export const accentColorDefinitions: Record<
  AccentColor,
  {
    i18nKey: string
    icon: string
  }
> = {
  amber: { i18nKey: 'theme_accent_amber', icon: 'icon-[mdi--circle]' },
  blue: { i18nKey: 'theme_accent_blue', icon: 'icon-[mdi--circle]' },
  cyan: { i18nKey: 'theme_accent_cyan', icon: 'icon-[mdi--circle]' },
  green: { i18nKey: 'theme_accent_green', icon: 'icon-[mdi--circle]' },
  indigo: { i18nKey: 'theme_accent_indigo', icon: 'icon-[mdi--circle]' },
  orange: { i18nKey: 'theme_accent_orange', icon: 'icon-[mdi--circle]' },
  pink: { i18nKey: 'theme_accent_pink', icon: 'icon-[mdi--circle]' },
  purple: { i18nKey: 'theme_accent_purple', icon: 'icon-[mdi--circle]' },
  red: { i18nKey: 'theme_accent_red', icon: 'icon-[mdi--circle]' },
  teal: { i18nKey: 'theme_accent_teal', icon: 'icon-[mdi--circle]' },
}

