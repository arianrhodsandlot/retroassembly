import type { CoreName } from './core'

export type PlatformName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'atarilynx'
  | 'famicom'
  | 'fds'
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'genesis'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'sega32x'
  | 'sfc'
  | 'sg-1000'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'wonderswan'
  | 'wonderswancolor'

export interface Platform {
  cores: CoreName[]
  displayName: string
  fileExtensions: string[]
  launchboxName: string
  libretroName: string
  name: PlatformName
}

// This link can be used as a reference for the array, but they may be not identical.
// https://github.com/RetroPie/RetroPie-Setup/blob/master/platforms.cfg
export const platforms: Platform[] = [
  {
    cores: [
      'mame2000',
      'mame2003',
      'mame2003_plus',
      'fbalpha2012_cps1',
      'fbalpha2012_cps2',
      'fbalpha2012',
      'fbalpha2012_neogeo',
      'fbneo',
    ],
    displayName: 'Arcade',
    fileExtensions: ['zip'].map((name) => `.${name}`),
    launchboxName: 'Arcade',
    libretroName: 'FBNeo - Arcade Games',
    name: 'arcade',
  },
  {
    cores: ['stella2014'],
    displayName: 'Atari 2600',
    fileExtensions: ['a26', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 2600',
    libretroName: 'Atari - 2600',
    name: 'atari2600',
  },
  {
    cores: ['a5200'],
    displayName: 'Atari 5200',
    fileExtensions: ['a52', 'xfd', 'atr', 'atx', 'cdm', 'cas', 'xex', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    cores: ['prosystem'],
    displayName: 'Atari 7800',
    fileExtensions: ['a78', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 7800',
    libretroName: 'Atari - 7800',
    name: 'atari7800',
  },
  {
    cores: ['mednafen_lynx', 'handy'],
    displayName: 'Atari Lynx',
    fileExtensions: ['lnx', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari Lynx',
    libretroName: 'Atari - Lynx',
    name: 'atarilynx',
  },
  {
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'Family Computer',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'famicom',
  },
  {
    cores: ['fceumm', 'nestopia'],
    displayName: 'Famicom Disk System',
    fileExtensions: ['fds', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  {
    cores: ['genesis_plus_gx', 'gearsystem'],
    displayName: 'Game Gear',
    fileExtensions: ['gg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy',
    fileExtensions: ['gb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    cores: ['mgba', 'vba_next'],
    displayName: 'Game Boy Advance',
    fileExtensions: ['gba', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy Color',
    fileExtensions: ['gb', 'gbc', 'cgb', 'sgb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Genesis',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'genesis',
  },
  {
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Megadrive',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'megadrive',
  },
  {
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'NES',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'nes',
  },
  {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket',
    fileExtensions: ['ngp', 'zip'].map((name) => `.${name}`),
    launchboxName: 'SNK Neo Geo Pocket',
    libretroName: 'SNK - Neo Geo Pocket',
    name: 'ngp',
  },
  {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket Color',
    fileExtensions: ['ngc', 'zip'].map((name) => `.${name}`),
    launchboxName: 'SNK Neo Geo Pocket Color',
    libretroName: 'SNK - Neo Geo Pocket Color',
    name: 'ngpc',
  },
  {
    cores: ['picodrive'],
    displayName: 'Sega 32X',
    fileExtensions: ['32x', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega 32X',
    libretroName: 'Sega - 32X',
    name: 'sega32x',
  },
  {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super Famicom',
    fileExtensions: ['smc', 'sfc'].map((name) => `.${name}`),
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'sfc',
  },
  {
    cores: ['gearsystem'],
    displayName: 'Sega SG-1000',
    fileExtensions: ['sg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega SG-1000',
    libretroName: 'Sega - SG-1000',
    name: 'sg-1000',
  },
  {
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Master System',
    fileExtensions: ['sms', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Master System',
    libretroName: 'Sega - Master System - Mark III',
    name: 'sms',
  },
  {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super NES',
    fileExtensions: ['smc', 'sfc'].map((name) => `.${name}`),
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'snes',
  },
  {
    cores: ['mednafen_vb'],
    displayName: 'Virtual Boy',
    fileExtensions: ['vb', 'vboy', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Virtual Boy',
    libretroName: 'Nintendo - Virtual Boy',
    name: 'vb',
  },
  {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan',
    fileExtensions: ['ws', 'zip'].map((name) => `.${name}`),
    launchboxName: 'WonderSwan',
    libretroName: 'Bandai - WonderSwan',
    name: 'wonderswan',
  },
  {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan Color',
    fileExtensions: ['wsc', 'zip'].map((name) => `.${name}`),
    launchboxName: 'WonderSwan Color',
    libretroName: 'Bandai - WonderSwan Color',
    name: 'wonderswancolor',
  },
]

export const platformMap: Record<string, Platform> = {}
for (const platform of platforms) {
  const keys = ['name', 'libretroName', 'launchboxName']
  for (const key of keys) {
    const value = platform[key]
    platformMap[value] = platform
  }
}
