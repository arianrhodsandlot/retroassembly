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
  bioses?: { md5?: string; name: string; required: boolean }[]
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
      { name: 'neogeo.zip', required: false },
      { name: 'neocdz.zip', required: false },
      { name: 'decocass.zip', required: false },
      { name: 'isgsm.zip', required: false },
      { name: 'midssio.zip', required: false },
      { name: 'nmk004.zip', required: false },
      { name: 'pgm.zip', required: false },
      { name: 'skns.zip', required: false },
      { name: 'ym2608.zip', required: false },
      { name: 'cchip.zip', required: false },
      { name: 'bubsys.zip', required: false },
      { name: 'namcoc69.zip', required: false },
      { name: 'namcoc70.zip', required: false },
      { name: 'namcoc75.zip', required: false },
      { name: 'coleco.zip', required: false },
      { name: 'fdsbios.zip', required: false },
      { name: 'msx.zip', required: false },
      { name: 'ngp.zip', required: false },
      { name: 'spectrum.zip', required: false },
      { name: 'spec128.zip', required: false },
      { name: 'spec1282a.zip', required: false },
      { name: 'channelf.zip', required: false },
      { name: 'hiscore.dat', required: false },
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
    cores: ['stella2014'],
    displayName: 'Atari 2600',
    fileExtensions: ['a26', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 2600',
    libretroName: 'Atari - 2600',
    name: 'atari2600',
  },
  {
    bioses: [{ md5: '281f20ea4320404ec820fb7ec0693b38', name: '5200.rom', required: false }],
    cores: ['a5200'],
    displayName: 'Atari 5200',
    fileExtensions: ['a52', 'xfd', 'atr', 'atx', 'cdm', 'cas', 'xex', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Atari 5200',
    libretroName: 'Atari - 5200',
    name: 'atari5200',
  },
  {
    bioses: [
      { md5: '0763f1ffb006ddbe32e52d497ee848ae', name: '7800 BIOS (U).rom', required: false },
      { md5: '397bb566584be7b9764e7a68974c4263', name: '7800 BIOS (E).rom', required: false },
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
    bioses: [
      { name: 'nes.pal', required: false },
      { name: 'gamegenie.nes', required: false },
    ],
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
      { name: 'nes.pal', required: false },
      { md5: '7f98d77d7a094ad7d069b74bd553ec98', name: 'gamegenie.nes', required: false },
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
    bioses: [{ md5: '672e104c3be3a238301aceffc3b23fd6', name: 'bios.gg', required: false }],
    cores: ['genesis_plus_gx', 'gearsystem'],
    displayName: 'Game Gear',
    fileExtensions: ['gg', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Game Gear',
    libretroName: 'Sega - Game Gear',
    name: 'gamegear',
  },
  {
    bioses: [{ md5: '32fbbd84168d3482956eb3c5051637f5', name: 'gb_bios.bin', required: false }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy',
    fileExtensions: ['gb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy',
    libretroName: 'Nintendo - Game Boy',
    name: 'gb',
  },
  {
    bioses: [{ md5: 'a860e8c0b6d573d191e4ec7db1b1e4f6', name: 'gba_bios.bin', required: false }],
    cores: ['mgba', 'vba_next'],
    displayName: 'Game Boy Advance',
    fileExtensions: ['gba', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Advance',
    libretroName: 'Nintendo - Game Boy Advance',
    name: 'gba',
  },
  {
    bioses: [{ md5: 'dbfce9db9deaa2567f6a84fde55f9680', name: 'gbc_bios.bin', required: false }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy Color',
    fileExtensions: ['gb', 'gbc', 'cgb', 'sgb', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Nintendo Game Boy Color',
    libretroName: 'Nintendo - Game Boy Color',
    name: 'gbc',
  },
  {
    bioses: [
      { md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin', required: false },
      { name: 'ggenie.bin', required: false },
    ],
    cores: ['genesis_plus_gx'],
    displayName: 'Genesis',
    fileExtensions: ['md', 'gen', 'zip'].map((name) => `.${name}`),
    launchboxName: 'Sega Genesis',
    libretroName: 'Sega - Mega Drive - Genesis',
    name: 'genesis',
  },
  {
    bioses: [
      { md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin', required: false },
      { name: 'ggenie.bin', required: false },
    ],
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
  //     { md5: 'e66fa1dc5820d254611fdcdba0662372', name: 'bios_CD_E.bin', required: false },
  //     { md5: '2efd74e3232ff260e371b99f84024f7f', name: 'bios_CD_U.bin', required: false },
  //     { md5: '278a9397d192149e84e820ac621a8edd', name: 'bios_CD_J.bin', required: false },
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
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_E.sms', required: false },
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_U.sms', required: false },
      { md5: '24a519c53f67b00640d0048ef7089105', name: 'bios_J.sms', required: false },
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
