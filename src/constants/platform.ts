import type { CoreName } from './core'

export type PlatformName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'fds'
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'wonderswan'
  | 'wonderswancolor'

interface Platform {
  cores: CoreName[]
  displayName: string
  fileExtensions: string[]
  launchboxName: string
  libretroName: string
  name: PlatformName
}

const platforms: Platform[] = [
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
    fileExtensions: ['zip'],
    launchboxName: 'Arcade',
    libretroName: 'FBNeo - Arcade Games',
    name: 'arcade',
  },
  {
    cores: ['stella2014'],
    displayName: 'Atari 2600',
    fileExtensions: ['a26', 'zip'],
    launchboxName: 'Atari 2600',
    libretroName: 'Atari - 2600',
    name: 'atari2600',
  },
  {
    cores: ['a5200'],
    displayName: 'Atari 5200',
    fileExtensions: ['a52', 'xfd', 'atr', 'atx', 'cdm', 'cas', 'xex', 'zip'],
    launchboxName: 'Atari - 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    cores: ['prosystem'],
    displayName: 'Atari 7800',
    fileExtensions: ['a78', '', 'zip'],
    launchboxName: 'Atari - 7800',
    libretroName: 'Atari - 7800',
    name: 'atari7800',
  },
  {
    cores: ['fceumm', 'nestopia'],
    displayName: 'Family Computer Disk System',
    fileExtensions: ['fds', 'zip'],
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  {
    cores: ['genesis_plus_gx', 'gearsystem'],
    displayName: 'Game Gear',
    fileExtensions: ['gg', 'zip'],
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy',
    fileExtensions: ['gb', 'zip'],
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    cores: ['mgba', 'vba_next'],
    displayName: 'Game Boy Advance',
    fileExtensions: ['gba', 'zip'],
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy Color',
    fileExtensions: ['gb', 'gbc', 'cgb', 'sgb', 'zip'],
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Genesis',
    fileExtensions: ['md', 'gen', 'zip'],
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'megadrive',
  },
  {
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'NES',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'],
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'nes',
  },
  {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket',
    fileExtensions: ['ngp', 'zip'],
    launchboxName: 'SNK Neo Geo Pocket',
    libretroName: 'SNK - Neo Geo Pocket',
    name: 'ngp',
  },
  {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket Color',
    fileExtensions: ['ngc', 'zip'],
    launchboxName: 'SNK Neo Geo Pocket Color',
    libretroName: 'SNK - Neo Geo Pocket Color',
    name: 'ngpc',
  },
  {
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Master System',
    fileExtensions: ['sms', 'zip'],
    launchboxName: 'Sega Master System',
    libretroName: 'Sega - Master System - Mark III',
    name: 'sms',
  },
  {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super Nintendo',
    fileExtensions: ['smc', 'sfc'],
    launchboxName: 'Super Nintendo Entertainment System',
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
    name: 'snes',
  },
  {
    cores: ['mednafen_vb'],
    displayName: 'Virtual Boy',
    fileExtensions: ['vb', 'vboy', 'zip'],
    launchboxName: 'Nintendo Virtual Boy',
    libretroName: 'Nintendo - Virtual Boy',
    name: 'vb',
  },
  {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan',
    fileExtensions: ['ws', 'zip'],
    launchboxName: 'WonderSwan',
    libretroName: 'Bandai - WonderSwan',
    name: 'wonderswan',
  },
  {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan Color',
    fileExtensions: ['wsc', 'zip'],
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
