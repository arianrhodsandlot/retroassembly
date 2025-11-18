import { cdnHost } from '#@/utils/isomorphic/cdn.ts'

const vendorsVersionInfo = {
  name: 'retroassembly-custom-cores',
  version: '1.22.0-20251116152137',
}

function getCoreCDNUrl(core: string, ext: string) {
  const { name, version } = vendorsVersionInfo
  const url = new URL('', cdnHost)
  const urlPathSegments = ['npm', `${name}@${version}`, 'dist', 'cores', `${core}_libretro.${ext}`]
  const urlPath = urlPathSegments.join('/')
  url.pathname = urlPath
  return url.href
}

export const coreUrlMap: Partial<Record<CoreName, { js: string; name: string; wasm: string }>> = {
  a5200: { js: getCoreCDNUrl('a5200', 'js'), name: 'a5200', wasm: getCoreCDNUrl('a5200', 'wasm') },
  prosystem: { js: getCoreCDNUrl('prosystem', 'js'), name: 'prosystem', wasm: getCoreCDNUrl('prosystem', 'wasm') },
  stella2014: { js: getCoreCDNUrl('stella2014', 'js'), name: 'stella2014', wasm: getCoreCDNUrl('stella2014', 'wasm') },
}

export { coreOptionsMap } from './core-options/index.ts'

export const cores = {
  a5200: {
    displayName: 'a5200',
    url: { js: getCoreCDNUrl('a5200', 'js'), name: 'a5200', wasm: getCoreCDNUrl('a5200', 'wasm') },
  },
  fbneo: {
    displayName: 'FinalBurn Neo',
    url: { js: getCoreCDNUrl('fbneo', 'js'), name: 'fbneo', wasm: getCoreCDNUrl('fbneo', 'wasm') },
  },
  fceumm: { displayName: 'FCEUmm' },
  freechaf: { displayName: 'FreeChaF' },
  gambatte: { displayName: 'Gambatte' },
  gearboy: { displayName: 'Gearboy' },
  gearcoleco: { displayName: 'Gearcoleco' },
  gearsystem: { displayName: 'Gearsystem' },
  genesis_plus_gx: { displayName: 'Genesis Plus GX' },
  gw: { displayName: 'GW' },
  handy: { displayName: 'Handy' },
  mame2003_plus: { displayName: 'MAME 2003-Plus' },
  mednafen_lynx: { displayName: 'Beetle Lynx' },
  mednafen_ngp: { displayName: 'Beetle NeoPop' },
  mednafen_pce_fast: { displayName: 'Beetle PC Engine Fast' },
  mednafen_vb: { displayName: 'Beetle VB' },
  mednafen_wswan: { displayName: 'Beetle Wonderswan' },
  mgba: { displayName: 'mGBA' },
  nestopia: { displayName: 'Nestopia' },
  o2em: { displayName: 'O2EM' },
  picodrive: { displayName: 'PicoDrive' },
  prosystem: {
    displayName: 'ProSystem',
    url: { js: getCoreCDNUrl('prosystem', 'js'), name: 'prosystem', wasm: getCoreCDNUrl('prosystem', 'wasm') },
  },
  quicknes: { displayName: 'QuickNES' },
  snes9x: { displayName: 'Snes9x' },
  snes9x2002: { displayName: 'Snes9x 2002' },
  snes9x2005: { displayName: 'Snes9x 2005' },
  snes9x2010: { displayName: 'Snes9x 2010' },
  stella2014: {
    displayName: 'Stella 2014',
    url: { js: getCoreCDNUrl('stella2014', 'js'), name: 'stella2014', wasm: getCoreCDNUrl('stella2014', 'wasm') },
  },
  tgbdual: { displayName: 'TGB Dual' },
  vba_next: { displayName: 'VBA Next' },
}

export const coreDisplayNameMap = Object.fromEntries(
  Object.entries(cores).map(([key, { displayName }]) => [key, displayName]),
)

export type CoreName = keyof typeof cores
