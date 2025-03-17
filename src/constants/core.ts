import { cdnHost } from '@/utils/cdn.ts'

export type CoreName =
  | 'a5200'
  | 'fbalpha2012_cps1'
  | 'fbalpha2012_cps2'
  | 'fbalpha2012_neogeo'
  | 'fbalpha2012'
  | 'fbneo'
  | 'fceumm'
  | 'gambatte'
  | 'gearboy'
  | 'gearsystem'
  | 'genesis_plus_gx'
  | 'handy'
  | 'mame2000'
  | 'mame2003_plus'
  | 'mame2003'
  | 'mednafen_lynx'
  | 'mednafen_ngp'
  | 'mednafen_vb'
  | 'mednafen_wswan'
  | 'mgba'
  | 'nestopia'
  | 'picodrive'
  | 'prosystem'
  | 'quicknes'
  | 'snes9x'
  | 'snes9x2002'
  | 'snes9x2005'
  | 'snes9x2010'
  | 'stella2014'
  | 'tgbdual'
  | 'vba_next'

export const coreOptionsMap: Partial<Record<CoreName, { defaultOption?: string; name: string; options: string[] }[]>> =
  {
    fceumm: [
      {
        name: 'fceumm_region',
        options: ['Auto', 'NTSC', 'PAL', 'Dendy'],
      },
      {
        name: 'fceumm_aspect',
        options: ['8:7 PAR', '4:3'],
      },
      {
        name: 'fceumm_palette',
        options: [
          'default',
          'asqrealc',
          'nintendo-vc',
          'rgb',
          'yuv-v3',
          'unsaturated-final',
          'sony-cxa2025as-us',
          'pal',
          'bmf-final2',
          'bmf-final3',
          'smooth-fbx',
          'composite-direct-fbx',
          'pvm-style-d93-fbx',
          'ntsc-hardware-fbx',
          'nes-classic-fbx-fs',
          'nescap',
          'wavebeam',
          'raw',
          'custom',
        ],
      },
      {
        name: 'fceumm_turbo_enable',
        options: ['Both', 'None', 'Player 1', 'Player 2'],
      },
      {
        name: 'fceumm_turbo_delay',
        options: ['2', '3', '5', '10', '15', '30', '60'],
      },
      {
        name: 'fceumm_up_down_allowed',
        options: ['disabled', 'enabled'],
      },
      {
        name: 'fceumm_nospritelimit',
        options: ['disabled', 'enabled'],
      },
      {
        name: 'fceumm_overclocking',
        options: ['disabled', '2x-Postrender', '2x-VBlank'],
      },
    ],
    genesis_plus_gx: [
      {
        name: 'genesis_plus_gx_system_hw',
        options: [
          'auto',
          'sg-1000',
          'sg-1000 II',
          'sg-1000 II + ram ext.',
          'mark-III',
          'master system',
          'master system II',
          'game gear',
          'mega drive / genesis',
        ],
      },
      { name: 'genesis_plus_gx_region_detect', options: ['auto', 'ntsc-u', 'pal', 'ntsc-j'] },
      { name: 'genesis_plus_gx_vdp_mode', options: ['auto', '60hz', '50hz'] },
      { name: 'genesis_plus_gx_bios', options: ['disabled', 'enabled'] },
      { name: 'genesis_plus_gx_aspect_ratio', options: ['auto', 'NTSC PAR', 'PAL PAR', '4:3', 'Uncorrected'] },
      { name: 'genesis_plus_gx_overscan', options: ['disabled', 'top/bottom', 'left/right', 'full'] },
    ],
    mgba: [
      {
        name: 'mgba_solar_sensor_level',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
      {
        name: 'mgba_allow_opposing_directions',
        options: ['OFF', 'ON'],
      },
      {
        name: 'mgba_gb_model',
        options: ['Autodetect', 'Game Boy', 'Super Game Boy', 'Game Boy Color', 'Game Boy Advance'],
      },
      {
        name: 'mgba_use_bios',
        options: ['ON', 'OFF'],
      },
      {
        name: 'mgba_skip_bios',
        options: ['OFF', 'ON'],
      },
      {
        name: 'mgba_sgb_borders',
        options: ['ON', 'OFF'],
      },
      {
        name: 'mgba_idle_optimization',
        options: ['Remove Known', 'Detect and Remove', "Don't Remove"],
      },
      {
        name: 'mgba_frameskip',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      },
    ],
    nestopia: [
      {
        name: 'nestopia_blargg_ntsc_filter',
        options: ['disabled', 'composite', 'svideo', 'rgb', 'monochrome'],
      },
      {
        name: 'nestopia_palette',
        options: [
          'cxa2025as',
          'consumer',
          'canonical',
          'alternative',
          'rgb',
          'pal',
          'composite-direct-fbx',
          'pvm-style-d93-fbx',
          'ntsc-hardware-fbx',
          'nes-classic-fbx-fs',
          'raw',
        ],
      },
      {
        name: 'nestopia_nospritelimit',
        options: ['disabled', 'enabled'],
      },
      {
        name: 'nestopia_overclock',
        options: ['1x', '2x'],
      },
      {
        name: 'nestopia_fds_auto_insert',
        options: ['enabled', 'disabled'],
      },
      {
        name: 'nestopia_overscan_v',
        options: ['enabled', 'disabled'],
      },
      {
        name: 'nestopia_overscan_h',
        options: ['disabled', 'enabled'],
      },
      {
        name: 'nestopia_aspect',
        options: ['auto', 'ntsc', 'pal', '4:3'],
      },
      {
        name: 'nestopia_favored_system',
        options: ['auto', 'ntsc', 'pal', 'famicom', 'dendy'],
      },
      {
        name: 'nestopia_turbo_pulse',
        options: ['2', '3', '4', '5', '6', '7', '8', '9'],
      },
    ],
    quicknes: [
      { name: 'quicknes_up_down_allowed', options: ['disabled', 'enabled'] },
      { name: 'quicknes_aspect_ratio_par', options: ['PAR', '4:3'] },
      { name: 'quicknes_use_overscan_h', options: ['enabled', 'disabled'] },
      { name: 'quicknes_use_overscan_v', options: ['disabled', 'enabled'] },
      { name: 'quicknes_no_sprite_limit', options: ['enabled', 'disabled'] },
      {
        name: 'quicknes_palette',
        options: [
          'default',
          'asqrealc',
          'nintendo-vc',
          'rgb',
          'yuv-v3',
          'unsaturated-final',
          'sony-cxa2025as-us',
          'pal',
          'bmf-final2',
          'bmf-final3',
          'smooth-fbx',
          'composite-direct-fbx',
          'pvm-style-d93-fbx',
          'ntsc-hardware-fbx',
          'nes-classic-fbx-fs',
          'nescap',
          'wavebeam',
        ],
      },
    ],
    snes9x: [
      { name: 'snes9x_up_down_allowed', options: ['disabled', 'enabled'] },
      { name: 'snes9x_region', options: ['auto', 'ntsc', 'pal'] },
      {
        name: 'snes9x_overclock_superfx',
        options: [
          '50%',
          '60%',
          '70%',
          '80%',
          '90%',
          '100%',
          '150%',
          '200%',
          '250%',
          '300%',
          '350%',
          '400%',
          '450%',
          '500%',
        ],
      },
      { name: 'snes9x_overclock_cycles', options: ['disabled', 'light', 'compatible', 'max'] },
      { name: 'snes9x_reduce_sprite_flicker', options: ['disabled', 'enabled'] },
      { name: 'snes9x_blargg', options: ['disabled', 'monochrome', 'rf', 'composite', 's-video', 'rgb'] },
      { name: 'snes9x_overscan', options: ['enabled', 'disabled', 'auto'] },
      { name: 'snes9x_aspect', options: ['4:3', 'uncorrected', 'auto', 'ntsc', 'pal'] },
      { name: 'snes9x_region', options: ['auto', 'ntsc', 'pal'] },
      {
        defaultOption: '2',
        name: 'snes9x_superscope_crosshair',
        options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
      },
      {
        name: 'snes9x_superscope_color',
        options: [
          'White',
          'White (blend)',
          'Red',
          'Red (blend)',
          'Orange',
          'Orange (blend)',
          'Yellow',
          'Yellow (blend)',
          'Green',
          'Green (blend)',
          'Cyan',
          'Cyan (blend)',
          'Sky',
          'Sky (blend)',
          'Blue',
          'Blue (blend)',
          'Violet',
          'Violet (blend)',
          'Pink',
          'Pink (blend)',
          'Purple',
          'Purple (blend)',
          'Black',
          'Black (blend)',
          '25% Grey',
          '25% Grey (blend)',
          '50% Grey',
          '50% Grey (blend)',
          '75% Grey',
          '75% Grey (blend)',
        ],
      },
      {
        name: 'snes9x_block_invalid_vram_access',
        options: ['enabled', 'disabled'],
      },
    ],
    vba_next: [{ name: 'vbanext_bios', options: ['On', 'Off'] }],
  }

const vendorsVersionInfo = {
  name: 'retro-assembly-vendors',
  version: '1.17.0-20240225183742',
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
  fbneo: { js: getCoreCDNUrl('fbneo', 'js'), name: 'fbneo', wasm: getCoreCDNUrl('fbneo', 'wasm') },
  prosystem: { js: getCoreCDNUrl('prosystem', 'js'), name: 'prosystem', wasm: getCoreCDNUrl('prosystem', 'wasm') },
  stella2014: { js: getCoreCDNUrl('stella2014', 'js'), name: 'stella2014', wasm: getCoreCDNUrl('stella2014', 'wasm') },
}
