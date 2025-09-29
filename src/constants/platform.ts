import { mapValues, sortBy } from 'es-toolkit'
import type { CoreName } from './core'

interface Bios {
  md5?: string
  name: string
  required?: boolean
}

interface BasePlatform {
  bioses?: Bios[]
  cores: CoreName[]
  displayName: string
  fileExtensions: string[]
  libretroName: string
}

// This link can be used as a reference for the array, but they may be not identical.
// https://github.com/RetroPie/RetroPie-Setup/blob/master/platforms.cfg
const basePlatformMap: Record<string, BasePlatform> = {
  arcade: {
    bioses: [
      { name: 'bubsys.zip' },
      { name: 'cchip.zip' },
      { name: 'channelf.zip' },
      { name: 'coleco.zip' },
      { name: 'decocass.zip' },
      { name: 'fdsbios.zip' },
      { name: 'hiscore.dat' },
      { name: 'isgsm.zip' },
      { name: 'midssio.zip' },
      { name: 'msx.zip' },
      { name: 'namcoc69.zip' },
      { name: 'namcoc70.zip' },
      { name: 'namcoc75.zip' },
      { name: 'neocdz.zip' },
      { name: 'neogeo.zip' },
      { name: 'ngp.zip' },
      { name: 'nmk004.zip' },
      { name: 'pgm.zip' },
      { name: 'skns.zip' },
      { name: 'spec128.zip' },
      { name: 'spec1282a.zip' },
      { name: 'spectrum.zip' },
      { name: 'ym2608.zip' },
    ],
    cores: ['mame2003_plus', 'fbneo'],
    displayName: 'Arcade',
    fileExtensions: ['.zip'],
    libretroName: 'MAME',
  },
  atari2600: {
    cores: ['stella2014'],
    displayName: 'Atari 2600',
    fileExtensions: ['.a26', '.zip'],
    libretroName: 'Atari - 2600',
  },
  atari5200: {
    bioses: [{ md5: '281f20ea4320404ec820fb7ec0693b38', name: '5200.rom' }],
    cores: ['a5200'],
    displayName: 'Atari 5200',
    fileExtensions: ['.a52', '.xfd', '.atr', '.atx', '.cdm', '.cas', '.xex', '.zip'],
    libretroName: 'Atari - 5200',
  },
  atari7800: {
    bioses: [
      { md5: '0763f1ffb006ddbe32e52d497ee848ae', name: '7800 BIOS (U).rom' },
      { md5: '397bb566584be7b9764e7a68974c4263', name: '7800 BIOS (E).rom' },
    ],
    cores: ['prosystem'],
    displayName: 'Atari 7800',
    fileExtensions: ['.a78', '.zip'],
    libretroName: 'Atari - 7800',
  },
  atarilynx: {
    bioses: [{ md5: 'fcd403db69f54290b51035d82f835e7b', name: 'lynxboot.img', required: true }],
    cores: ['mednafen_lynx'],
    displayName: 'Atari Lynx',
    fileExtensions: ['.lnx', '.lyx', '.bll', '.o', '.zip'],
    libretroName: 'Atari - Lynx',
  },
  channelf: {
    bioses: [
      { md5: 'da98f4bb3242ab80d76629021bb27585', name: 'sl31254.bin', required: true },
      { md5: '95d339631d867c8f1d15a5f2ec26069d', name: 'sl90025.bin', required: true },
      { md5: 'ac9804d4c0e9d07e33472e3726ed15c3', name: 'sl31253.bin', required: true },
    ],
    cores: ['freechaf'],
    displayName: 'Channel F',
    fileExtensions: ['.bin', '.rom', '.zip'],
    libretroName: 'Fairchild - Channel F',
  },
  colecovision: {
    bioses: [{ md5: '2c66f5911e5b42b8ebe113403548eee7', name: 'colecovision.rom', required: true }],
    cores: ['gearcoleco'],
    displayName: 'ColecoVision',
    fileExtensions: ['.col', '.cv', '.bin', '.rom', '.zip'],
    libretroName: 'Coleco - ColecoVision',
  },
  famicom: {
    bioses: [{ name: 'nes.pal' }, { name: 'gamegenie.nes' }],
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'Family Computer',
    fileExtensions: ['.nes', '.unif', '.unf', '.zip'],
    libretroName: 'Nintendo - Nintendo Entertainment System',
  },
  fds: {
    bioses: [
      { md5: 'ca30b50f880eb660a320674ed365ef7a', name: 'disksys.rom', required: true },
      { name: 'nes.pal' },
      { md5: '7f98d77d7a094ad7d069b74bd553ec98', name: 'gamegenie.nes' },
    ],
    cores: ['fceumm', 'nestopia'],
    displayName: 'Famicom Disk System',
    fileExtensions: ['.fds', '.zip'],
    libretroName: 'Nintendo - Family Computer Disk System',
  },
  gameandwatch: {
    cores: ['gw'],
    displayName: 'Game & Watch',
    fileExtensions: ['.zip', '.mgw'],
    libretroName: 'Handheld Electronic Game',
  },
  gamegear: {
    bioses: [{ md5: '672e104c3be3a238301aceffc3b23fd6', name: 'bios.gg' }],
    cores: ['genesis_plus_gx', 'gearsystem'],
    displayName: 'Game Gear',
    fileExtensions: ['.gg', '.zip'],
    libretroName: 'Sega - Game Gear',
  },
  gb: {
    bioses: [{ md5: '32fbbd84168d3482956eb3c5051637f5', name: 'gb_bios.bin' }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy',
    fileExtensions: ['.gb', '.zip'],
    libretroName: 'Nintendo - Game Boy',
  },
  gba: {
    bioses: [{ md5: 'a860e8c0b6d573d191e4ec7db1b1e4f6', name: 'gba_bios.bin' }],
    cores: ['mgba', 'vba_next'],
    displayName: 'Game Boy Advance',
    fileExtensions: ['.gba', '.zip'],
    libretroName: 'Nintendo - Game Boy Advance',
  },
  gbc: {
    bioses: [{ md5: 'dbfce9db9deaa2567f6a84fde55f9680', name: 'gbc_bios.bin' }],
    cores: ['mgba', 'gearboy', 'gambatte', 'tgbdual'],
    displayName: 'Game Boy Color',
    fileExtensions: ['.gb', '.gbc', '.cgb', '.sgb', '.zip'],
    libretroName: 'Nintendo - Game Boy Color',
  },
  genesis: {
    bioses: [{ md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin' }, { name: 'ggenie.bin' }],
    cores: ['genesis_plus_gx'],
    displayName: 'Genesis',
    fileExtensions: ['.md', '.gen', '.zip'],
    libretroName: 'Sega - Mega Drive - Genesis',
  },
  megadrive: {
    bioses: [{ md5: '45e298905a08f9cfb38fd504cd6dbc84', name: 'bios_MD.bin' }, { name: 'ggenie.bin' }],
    cores: ['genesis_plus_gx'],
    displayName: 'Megadrive',
    fileExtensions: ['.md', '.gen', '.zip'],
    libretroName: 'Sega - Mega Drive - Genesis',
  },
  nes: {
    cores: ['fceumm', 'nestopia', 'quicknes'],
    displayName: 'NES',
    fileExtensions: ['.nes', '.unif', '.unf', '.zip'],
    libretroName: 'Nintendo - Nintendo Entertainment System',
  },
  ngp: {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket',
    fileExtensions: ['.ngp', '.zip'],
    libretroName: 'SNK - Neo Geo Pocket',
  },
  ngpc: {
    cores: ['mednafen_ngp'],
    displayName: 'Neo Geo Pocket Color',
    fileExtensions: ['.ngc', '.zip'],
    libretroName: 'SNK - Neo Geo Pocket Color',
  },
  odyssey2: {
    bioses: [{ name: 'o2rom.bin', required: true }],
    cores: ['o2em'],
    displayName: 'Magnavox Odyssey 2',
    fileExtensions: ['.bin', '.zip'],
    libretroName: 'Magnavox - Odyssey2',
  },
  pcengine: {
    bioses: [
      { md5: '38179df8f4ac870017db21ebcbf53114', name: 'syscard3.pce', required: true },
      { md5: 'd3f5b2d4f2a9b6c1e3f3f2e4e6f4c8e1', name: 'syscard2.pce' },
      { md5: '5e3f3f2e4e6f4c8e1d3f5b2d4f2a9b6c', name: 'syscard1.pce' },
      { md5: '5e3f3f2e4e6f4c8e1d3f5b2d4f2a9b6c', name: 'gexpress.pce' },
    ],
    cores: ['mednafen_pce_fast'],
    displayName: 'PC Engine',
    fileExtensions: ['.pce', '.iso', '.img', '.bin', '.chd', '.zip'],
    libretroName: 'NEC - PC Engine - TurboGrafx 16',
  },
  sega32x: {
    cores: ['picodrive'],
    displayName: 'Sega 32X',
    fileExtensions: ['.bin', '.iso', '.zip'],
    libretroName: 'Sega - 32X',
  },
  sfc: {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super Famicom',
    fileExtensions: ['.smc', '.sfc', '.zip'],
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
  },
  'sg-1000': {
    cores: ['gearsystem'],
    displayName: 'Sega SG-1000',
    fileExtensions: ['.sg', '.zip'],
    libretroName: 'Sega - SG-1000',
  },
  sms: {
    bioses: [
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_E.sms' },
      { md5: '840481177270d5642a14ca71ee72844c', name: 'bios_U.sms' },
      { md5: '24a519c53f67b00640d0048ef7089105', name: 'bios_J.sms' },
    ],
    cores: ['genesis_plus_gx', 'picodrive', 'gearsystem'],
    displayName: 'Master System',
    fileExtensions: ['.sms', '.zip'],
    libretroName: 'Sega - Master System - Mark III',
  },
  snes: {
    cores: ['snes9x', 'snes9x2002', 'snes9x2005', 'snes9x2010'],
    displayName: 'Super NES',
    fileExtensions: ['.smc', '.sfc', '.zip'],
    libretroName: 'Nintendo - Super Nintendo Entertainment System',
  },
  vb: {
    cores: ['mednafen_vb'],
    displayName: 'Virtual Boy',
    fileExtensions: ['.vb', '.vboy', '.zip'],
    libretroName: 'Nintendo - Virtual Boy',
  },
  videopac: {
    bioses: [{ name: 'o2rom.bin', required: true }],
    cores: ['o2em'],
    displayName: 'Philips Videopac+',
    fileExtensions: ['.bin', '.zip'],
    libretroName: 'Philips - Videopac+',
  },
  wonderswan: {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan',
    fileExtensions: ['.ws', '.zip'],
    libretroName: 'Bandai - WonderSwan',
  },
  wonderswancolor: {
    cores: ['mednafen_wswan'],
    displayName: 'WonderSwan Color',
    fileExtensions: ['.wsc', '.zip'],
    libretroName: 'Bandai - WonderSwan Color',
  },
}

export type PlatformName = keyof typeof basePlatformMap

export interface Platform extends BasePlatform {
  name: PlatformName
}

export const platformMap: Record<PlatformName, Platform> = mapValues(
  basePlatformMap,
  (platform, name: PlatformName) => ({ name, ...platform }),
)
export const platforms = sortBy(Object.values(platformMap), ['displayName'])
