import type { CoreName } from './core'

export type PlatformName =
  | 'arcade'
  | 'atari2600'
  | 'atari5200'
  | 'atari7800'
  | 'atarilynx'
  | 'channelf'
  | 'colecovision'
  | 'famicom'
  | 'fds'
  | 'gameandwatch'
  | 'gamegear'
  | 'gb'
  | 'gba'
  | 'gbc'
  | 'genesis'
  | 'megadrive'
  | 'nes'
  | 'ngp'
  | 'ngpc'
  | 'odyssey2'
  | 'pcengine'
  | 'sega32x'
  | 'sfc'
  | 'sg-1000'
  | 'sms'
  | 'snes'
  | 'vb'
  | 'videopac'
  | 'wonderswan'
  | 'wonderswancolor'

export interface Platform {
  bioses?: { md5?: string; name: string; required?: boolean }[]
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
    bioses: [
      { name: 'neogeo.zip' },
      { name: 'neocdz.zip' },
      { name: 'decocass.zip' },
      { name: 'isgsm.zip' },
      { name: 'midssio.zip' },
      { name: 'nmk004.zip' },
      { name: 'pgm.zip' },
      { name: 'skns.zip' },
      { name: 'ym2608.zip' },
      { name: 'cchip.zip' },
      { name: 'bubsys.zip' },
      { name: 'namcoc69.zip' },
      { name: 'namcoc70.zip' },
      { name: 'namcoc75.zip' },
      { name: 'coleco.zip' },
      { name: 'fdsbios.zip' },
      { name: 'msx.zip' },
      { name: 'ngp.zip' },
      { name: 'spectrum.zip' },
      { name: 'spec128.zip' },
      { name: 'spec1282a.zip' },
      { name: 'channelf.zip' },
      { name: 'hiscore.dat' },
    ],
    cores: ['mame2003_plus', 'fbneo'],
    displayName: 'Arcade',
    fileExtensions: ['zip'].map((name) => `.${name}`),
    launchboxName: 'Arcade',
    libretroName: 'MAME',
    name: 'arcade',
  },
  {
    bioses: [{ name: 'o2rom.bin', required: true }],
    cores: ['o2em'],
    displayName: 'Magnavox Odyssey 2',
    fileExtensions: ['bin', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Magnavox Odyssey 2',
    libretroName: 'Magnavox - Odyssey2',
    name: 'odyssey2',
  },
  {
    bioses: [{ name: 'o2rom.bin', required: true }],
    cores: ['o2em'],
    displayName: 'Philips Videopac+',
    fileExtensions: ['bin', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Philips Videopac+',
    libretroName: 'Philips - Videopac+',
    name: 'videopac',
  },
  {
    bioses: [{ md5: '2c66f5911e5b42b8ebe113403548eee7', name: 'colecovision.rom', required: true }],
    cores: ['gearcoleco'],
    displayName: 'ColecoVision',
    fileExtensions: ['col', 'cv', 'bin', 'rom', 'zip'].map((name) => `.${name}`),
    launchboxName: 'ColecoVision',
    libretroName: 'Coleco - ColecoVision',
    name: 'colecovision',
  },
  {
    bioses: [
      { md5: 'da98f4bb3242ab80d76629021bb27585', name: 'sl31254.bin', required: true },
      { md5: '95d339631d867c8f1d15a5f2ec26069d', name: 'sl90025.bin', required: true },
      { md5: 'ac9804d4c0e9d07e33472e3726ed15c3', name: 'sl31253.bin', required: true },
    ],
    cores: ['freechaf'],
    displayName: 'Channel F',
    fileExtensions: ['bin', 'rom', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Fairchild Channel F',
    libretroName: 'Fairchild - Channel F',
    name: 'channelf',
  },
  {
    bioses: [
      { md5: '38179df8f4ac870017db21ebcbf53114', name: 'syscard3.pce', required: true },
      { md5: 'd3f5b2d4f2a9b6c1e3f3f2e4e6f4c8e1', name: 'syscard2.pce' },
      { md5: '5e3f3f2e4e6f4c8e1d3f5b2d4f2a9b6c', name: 'syscard1.pce' },
      { md5: '5e3f3f2e4e6f4c8e1d3f5b2d4f2a9b6c', name: 'gexpress.pce' },
    ],
    cores: ['mednafen_pce_fast'],
    displayName: 'PC Engine',
    fileExtensions: ['pce', 'iso', 'img', 'bin', 'chd', 'zip'].map((name) => `.${name}`),
    launchboxName: 'NEC TurboGrafx-16',
    libretroName: 'NEC - PC Engine - TurboGrafx 16',
    name: 'pcengine',
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
    bioses: [{ md5: '281f20ea4320404ec820fb7ec0693b38', name: '5200.rom' }],
    cores: ['a5200'],
    displayName: 'Atari 5200',
    fileExtensions: ['a52', 'xfd', 'atr', 'atx', 'cdm', 'cas', 'xex', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    bioses: [
      { md5: '0763f1ffb006ddbe32e52d497ee848ae', name: '7800 BIOS (U).rom' },
      { md5: '397bb566584be7b9764e7a68974c4263', name: '7800 BIOS (E).rom' },
    ],
    cores: ['prosystem'],
    displayName: 'Atari 7800',
    fileExtensions: ['a78', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 7800',
    libretroName: 'Atari - 7800',
    name: 'atari7800',
  },
  {
    bioses: [{ md5: 'fcd403db69f54290b51035d82f835e7b', name: 'lynxboot.img', required: true }],
    cores: ['mednafen_lynx'],
    displayName: 'Atari Lynx',
    fileExtensions: ['lnx', 'lyx', 'bll', 'o', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari Lynx',
    libretroName: 'Atari - Lynx',
    name: 'atarilynx',
  },
  {
    bioses: [{ name: 'nes.pal' }, { name: 'gamegenie.nes' }],
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'Family Computer',
    fileExtensions: ['nes', 'unif', 'unf', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Entertainment System',
    libretroName: 'Nintendo - Nintendo Entertainment System',
    name: 'famicom',
  },
  {
    bioses: [
      { md5: 'ca30b50f880eb660a320674ed365ef7a', name: 'disksys.rom', required: true },
      { name: 'nes.pal' },
      { md5: '7f98d77d7a094ad7d069b74bd553ec98', name: 'gamegenie.nes' },
    ],
    cores: ['fceumm', 'nestopia'],
    displayName: 'Famicom Disk System',
    fileExtensions: ['fds', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Famicom Disk System',
    libretroName: 'Nintendo - Family Computer Disk System',
    name: 'fds',
  },
  {
    cores: ['gw'],
    displayName: 'Game & Watch',
    fileExtensions: ['zip', 'mgw'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game & Watch',
    libretroName: 'Handheld Electronic Game',
    name: 'gameandwatch',
  },
  {
    bioses: [{ md5: '672e104c3be3a238301aceffc3b23fd6', name: 'bios.gg' }],
    cores: ['genesis_plus_gx', 'gearsystem'],
    displayName: 'Game Gear',
    fileExtensions: ['gg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    bioses: [{ md5: '32fbbd84168d3482956eb3c5051637f5', name: 'gb_bios.bin' }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy',
    fileExtensions: ['gb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    bioses: [{ md5: 'a860e8c0b6d573d191e4ec7db1b1e4f6', name: 'gba_bios.bin' }],
    cores: ['mgba', 'vba_next'],
    displayName: 'Game Boy Advance',
    fileExtensions: ['gba', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    bioses: [{ md5: 'dbfce9db9deaa2567f6a84fde55f9680', name: 'gbc_bios.bin' }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy Color',
    fileExtensions: ['gb', 'gbc', 'cgb', 'sgb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    bioses: [{ md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin' }, { name: 'ggenie.bin' }],
    cores: ['genesis_plus_gx'],
    displayName: 'Genesis',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'genesis',
  },
  {
    bioses: [{ md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin' }, { name: 'ggenie.bin' }],
    cores: ['genesis_plus_gx'],
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
  // {
  //   bioses: [
  //     { md5: 'e66fa1dc5820d254611fdcdba0662372', name: 'bios_CD_E.bin' },
  //     { md5: '2efd74e3232ff260e371b99f84024f7f', name: 'bios_CD_U.bin' },
  //     { md5: '278a9397d192149e84e820ac621a8edd', name: 'bios_CD_J.bin' },
  //   ],
  //   cores: ['picodrive'],
  //   displayName: 'Sega 32X',
  //   fileExtensions: ['32x', 'zip'].map((name) => `.${name}`),
  //   launchboxName: 'Sega 32X',
  //   libretroName: 'Sega - 32X',
  //   name: 'sega32x',
  // },
  {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super Famicom',
    fileExtensions: ['smc', 'sfc', 'zip'].map((name) => `.${name}`),
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
    bioses: [
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_E.sms' },
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_U.sms' },
      { md5: '24a519c53f67b00640d0048ef7089105', name: 'bios_J.sms' },
    ],
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
    fileExtensions: ['smc', 'sfc', 'zip'].map((name) => `.${name}`),
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
  const keys = ['name', 'libretroName', 'launchboxName'] as const
  for (const key of keys) {
    const value = platform[key]
    platformMap[value] = platform
  }
}
