import { range } from 'es-toolkit'
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

interface CoreOption {
  defaultOption?: string
  name: string
  options: string[]
  title?: string
}

export const coreOptionsMap: Partial<Record<CoreName, CoreOption[]>> = {
  a5200: [
    { name: 'a5200_bios', options: ['internal', 'official'], title: 'BIOS' },
    {
      name: 'a5200_mix_frames',
      options: ['disabled', 'mix', 'ghost_65', 'ghost_75', 'ghost_85', 'ghost_95'],
      title: 'Interframe Blending',
    },
    {
      name: 'a5200_artifacting_mode',
      options: ['none', 'blue/brown 1', 'blue/brown 2', 'GTIA', 'CTIA'],
      title: 'Hi-Res Artifacting Mode',
    },
    {
      name: 'a5200_enable_new_pokey',
      options: ['enabled', 'disabled'],
      title: 'High Fidelity POKEY',
    },
    {
      name: 'a5200_input_hack',
      options: ['disabled', 'dual_stick', 'swap_ports'],
      title: 'Controller Hacks',
    },
    {
      name: 'a5200_pause_is_reset',
      options: ['disabled', 'enabled'],
      title: 'Pause acts as Reset',
    },
    {
      name: 'a5200_analog_response',
      options: ['linear', 'quadratic'],
      title: 'Analog Joystick Response',
    },
    {
      name: 'a5200_analog_device',
      options: ['analog_stick', 'mouse'],
      title: 'Analog Device',
    },
  ],
  fceumm: [
    {
      name: 'fceumm_region',
      options: ['Auto', 'NTSC', 'PAL', 'Dendy'],
      title: 'Region',
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
      title: 'Color Palette',
    },
    {
      name: 'fceumm_turbo_enable',
      options: ['Both', 'None', 'Player 1', 'Player 2'],
      title: 'Turbo Enable',
    },
    {
      name: 'fceumm_turbo_delay',
      options: ['2', '3', '5', '10', '15', '30', '60'],
      title: 'Turbo Delay (in frames)',
    },
    {
      name: 'fceumm_up_down_allowed',
      options: ['disabled', 'enabled'],
      title: 'Allow Opposing Directions',
    },
    {
      name: 'fceumm_overscan_h',
      options: ['disabled', 'enabled'],
      title: 'Crop Overscan (Horizontal)',
    },
    {
      name: 'fceumm_overscan_v',
      options: ['disabled', 'enabled'],
      title: 'Crop Overscan (Vertical)',
    },
    {
      name: 'fceumm_sndquality',
      options: ['Low', 'High', 'Very High'],
      title: 'Sound Quality',
    },
    {
      name: 'fceumm_zapper_mode',
      options: ['clightgun', 'stlightgun', 'touchscreen', 'mouse'],
      title: 'Zapper Mode',
    },
    {
      name: 'fceumm_nospritelimit',
      options: ['disabled', 'enabled'],
      title: 'No Sprite Limit',
    },
    {
      name: 'fceumm_overclocking',
      options: ['disabled', '2x-Postrender', '2x-VBlank'],
      title: 'Overclocking',
    },
    {
      name: 'fceumm_ramstate',
      options: ['fill $ff', 'fill $00', 'random'],
      title: 'RAM power up state',
    },
    {
      name: 'fceumm_arkanoid_mode',
      options: ['mouse', 'abs_mouse', 'stelladaptor', 'touchscreen'],
      title: 'Arkanoid Mode',
    },
    {
      defaultOption: '100',
      name: 'fceumm_mouse_sensitivity',
      options: [
        '20',
        '30',
        '40',
        '50',
        '60',
        '70',
        '80',
        '90',
        '100',
        '110',
        '120',
        '130',
        '140',
        '150',
        '160',
        '170',
        '180',
        '190',
        '200',
      ],
      title: 'Mouse Sensitivity',
    },
  ],
  gambatte: [
    {
      name: 'gambatte_gb_colorization',
      options: ['disabled', 'auto', 'GBC', 'SGB', 'internal', 'custom'],
      title: 'GB Colorization',
    },
    {
      name: 'gambatte_gb_internal_palette',
      options: [
        'GB - DMG',
        'GB - Pocket',
        'GB - Light',
        'GBC - Blue',
        'GBC - Brown',
        'GBC - Dark Blue',
        'GBC - Dark Brown',
        'GBC - Dark Green',
        'GBC - Grayscale',
        'GBC - Green',
        'GBC - Inverted',
        'GBC - Orange',
        'GBC - Pastel Mix',
        'GBC - Red',
        'GBC - Yellow',
        'SGB - 1A',
        'SGB - 1B',
        'SGB - 1C',
        'SGB - 1D',
        'SGB - 1E',
        'SGB - 1F',
        'SGB - 1G',
        'SGB - 1H',
        'SGB - 2A',
        'SGB - 2B',
        'SGB - 2C',
        'SGB - 2D',
        'SGB - 2E',
        'SGB - 2F',
        'SGB - 2G',
        'SGB - 2H',
        'SGB - 3A',
        'SGB - 3B',
        'SGB - 3C',
        'SGB - 3D',
        'SGB - 3E',
        'SGB - 3F',
        'SGB - 3G',
        'SGB - 3H',
        'SGB - 4A',
        'SGB - 4B',
        'SGB - 4C',
        'SGB - 4D',
        'SGB - 4E',
        'SGB - 4F',
        'SGB - 4G',
        'SGB - 4H',
        'Special 1',
        'Special 2',
        'Special 3',
        'Special 4 (TI-83 Legacy)',
        'TWB64 - Pack 1',
        'TWB64 - Pack 2',
        'TWB64 - Pack 3',
        'PixelShift - Pack 1',
      ],
      title: 'Internal Palette',
    },
    {
      name: 'gambatte_gbc_color_correction',
      options: ['GBC only', 'always', 'disabled'],
      title: 'Color Correction',
    },
    {
      name: 'gambatte_gbc_color_correction_mode',
      options: ['accurate', 'fast'],
      title: 'Color Correction Mode',
    },
    {
      name: 'gambatte_gbc_frontlight_position',
      options: ['central', 'above screen', 'below screen'],
      title: 'Color Correction - Frontlight Position',
    },
    {
      name: 'gambatte_dark_filter_level',
      options: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
      title: 'Dark Filter Level (%)',
    },
    {
      name: 'gambatte_mix_frames',
      options: ['disabled', 'mix', 'lcd_ghosting', 'lcd_ghosting_fast'],
      title: 'Interframe Blending',
    },
    {
      name: 'gambatte_audio_resampler',
      options: ['sinc', 'cc'],
      title: 'Audio Resampler',
    },
    {
      name: 'gambatte_gb_hwmode',
      options: ['Auto', 'GB', 'GBC', 'GBA'],
      title: 'Emulated Hardware',
    },
    {
      name: 'gambatte_gb_bootloader',
      options: ['enabled', 'disabled'],
      title: 'Use Official Bootloader',
    },
    {
      name: 'gambatte_turbo_period',
      options: ['4', '5', '6', '7', '8', '9', '10'],
      title: 'Turbo Button Period',
    },
    {
      name: 'gambatte_rumble_level',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      title: 'Controller Rumble Strength',
    },
  ],
  gearboy: [
    { name: 'gearboy_model', options: ['Auto', 'Game Boy DMG'], title: 'Emulated Model' },
    { name: 'gearboy_palette', options: ['Original', 'Sharp', 'B/W', 'Autumn', 'Soft', 'Slime'], title: 'Palette' },
    { name: 'gearboy_up_down_allowed', options: ['Disabled', 'Enabled'], title: 'Allow Up+Down / Left+Right' },
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
      title: 'System hardware',
    },
    { name: 'genesis_plus_gx_region_detect', options: ['auto', 'ntsc-u', 'pal', 'ntsc-j'], title: 'System region' },
    { name: 'genesis_plus_gx_vdp_mode', options: ['auto', '60hz', '50hz'], title: 'Force VDP Mode' },
    {
      name: 'genesis_plus_gx_aspect_ratio',
      options: ['auto', 'NTSC PAR', 'PAL PAR', '4:3', 'Uncorrected'],
      title: 'Core-Provided Aspect Ratio',
    },
    { name: 'genesis_plus_gx_overscan', options: ['disabled', 'top/bottom', 'left/right', 'full'], title: 'Borders' },
    {
      name: 'genesis_plus_gx_left_border',
      options: ['disabled', 'left border', 'left & right borders'],
      title: 'Hide Master System Side Borders',
    },
    {
      name: 'genesis_plus_gx_gg_extra',
      options: ['disabled', 'enabled'],
      title: 'Game Gear Extended Screen',
    },
    {
      name: 'genesis_plus_gx_blargg_ntsc_filter',
      options: ['disabled', 'monochrome', 'composite', 'svideo', 'rgb'],
      title: 'Blargg NTSC Filter',
    },
    { name: 'genesis_plus_gx_lcd_filter', options: ['disabled', 'enabled'], title: 'LCD Filter' },
    { name: 'genesis_plus_gx_render', options: ['single field', 'double field'], title: 'Interlaced Mode 2 Output' },
    { name: 'genesis_plus_gx_frameskip', options: ['disabled', 'auto', 'manual'], title: 'Frameskip' },
    {
      defaultOption: '33',
      name: 'genesis_plus_gx_frameskip_threshold',
      options: ['15', '18', '21', '24', '27', '30', '33', '36', '39', '42', '45', '48', '51', '54', '57', '60'],
      title: 'Frameskip Threshold (%)',
    },
    {
      name: 'genesis_plus_gx_ym2413',
      options: ['auto', 'disabled', 'enabled'],
      title: 'Master System FM (YM2413)',
    },
    {
      name: 'genesis_plus_gx_no_sprite_limit',
      options: ['disabled', 'enabled'],
      title: 'Remove Per-Line Sprite Limit',
    },
    {
      name: 'genesis_plus_gx_enhanced_vscroll',
      options: ['disabled', 'enabled'],
      title: 'Enhanced per-tile vertical scroll',
    },
    {
      defaultOption: '8',
      name: 'genesis_plus_gx_enhanced_vscroll_limit',
      options: ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
      title: 'Enhanced per-tile vertical scroll limit',
    },
    {
      name: 'genesis_plus_gx_overclock',
      options: [
        '100',
        '125',
        '150',
        '175',
        '200',
        '225',
        '250',
        '275',
        '300',
        '325',
        '350',
        '375',
        '400',
        '425',
        '450',
        '475',
        '500',
      ],
      title: 'CPU Speed',
    },
    {
      name: 'genesis_plus_gx_force_dtack',
      options: ['enabled', 'disabled'],
      title: 'System Locks-Ups',
    },
    {
      name: 'genesis_plus_gx_addr_error',
      options: ['enabled', 'disabled'],
      title: '68K Address Error',
    },
    {
      name: 'genesis_plus_gx_cd_latency',
      options: ['enabled', 'disabled'],
      title: 'CD Access Time',
    },
    {
      name: 'genesis_plus_gx_cd_precache',
      options: ['disabled', 'enabled'],
      title: 'CD Image Cache',
    },
  ],
  handy: [
    {
      name: 'handy_refresh_rate',
      options: ['50', '60', '75', '100', '120'],
      title: 'Video Refresh Rate',
    },
    {
      name: 'handy_rot',
      options: ['Auto', 'None', '270', '180', '90'],
      title: 'Display Rotation',
    },
    {
      name: 'handy_gfx_colors',
      options: ['16bit', '24bit'],
      title: 'Color Depth',
    },
    {
      name: 'handy_lcd_ghosting',
      options: ['disabled', '2frames', '3frames', '4frames'],
      title: 'LCD Ghosting Filter',
    },
    {
      name: 'handy_overclock',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '20', '30', '40', '50'],
      title: 'CPU Overclock Multiplier',
    },
    {
      name: 'handy_frameskip',
      options: ['disabled', 'auto', 'manual'],
      title: 'Frameskip',
    },
    {
      name: 'handy_frameskip_threshold',
      options: ['15', '18', '21', '24', '27', '30', '33', '36', '39', '42', '45', '48', '51', '54', '57', '60'],
      title: 'Frameskip Threshold',
    },
  ],
  mednafen_lynx: [
    {
      name: 'lynx_rot_screen',
      options: ['auto', 'manual', '0', '90', '180', '270'],
      title: 'Auto-rotate Screen',
    },
    {
      name: 'lynx_pix_format',
      options: ['16', '32'],
      title: 'Color Format',
    },
    {
      name: 'lynx_force_60hz',
      options: ['disabled', 'enabled'],
      title: 'Force 60Hz',
    },
  ],
  mednafen_ngp: [
    {
      name: 'ngp_language',
      options: ['english', 'japanese'],
      title: 'Language',
    },
  ],
  mednafen_vb: [
    {
      name: 'vb_3dmode',
      options: ['anaglyph', 'cyberscope', 'side-by-side', 'vli', 'hli'],
      title: '3D mode',
    },
    {
      name: 'vb_anaglyph_preset',
      options: ['disabled', 'red & blue', 'red & cyan', 'red & electric cyan', 'green & magenta', 'yellow & blue'],
      title: 'Anaglyph preset',
    },
    {
      name: 'vb_color_mode',
      options: [
        'black & red',
        'black & white',
        'black & blue',
        'black & cyan',
        'black & electric cyan',
        'black & green',
        'black & magenta',
        'black & yellow',
      ],
      title: 'Palette',
    },
    {
      name: 'vb_right_analog_to_digital',
      options: ['disabled', 'enabled', 'invert x', 'invert y', 'invert both'],
      title: 'Right analog to digital',
    },
    {
      name: 'vb_cpu_emulation',
      options: ['fast', 'accurate'],
      title: 'CPU emulation',
    },
  ],
  mednafen_wswan: [
    {
      name: 'wswan_rotate_display',
      options: ['manual', 'landscape', 'portrait'],
      title: 'Display Rotation',
    },
    {
      name: 'wswan_rotate_keymap',
      options: ['auto', 'disabled', 'enabled'],
      title: 'Rotate Button Mappings',
    },
    {
      name: 'wswan_mono_palette',
      options: [
        'default',
        'wonderswan',
        'wondeswan_color',
        'swancrystal',
        'gb_dmg',
        'gb_pocket',
        'gb_light',
        'blossom_pink',
        'bubbles_blue',
        'buttercup_green',
        'digivice',
        'game_com',
        'gameking',
        'game_master',
        'golden_wild',
        'greenscale',
        'hokage_orange',
        'labo_fawn',
        'legendary_super_saiyan',
        'microvision',
        'million_live_gold',
        'odyssey_gold',
        'shiny_sky_blue',
        'slime_blue',
        'ti_83',
        'travel_wood',
        'virtual_boy',
      ],
      title: 'Color Palette',
    },
    {
      name: 'wswan_gfx_colors',
      options: ['16bit', '24bit'],
      title: 'Color Depth',
    },
    { name: 'wswan_60hz_mode', options: ['disabled', 'enabled'], title: '60Hz Mode' },
    {
      defaultOption: '44100',
      name: 'wswan_sound_sample_rate',
      options: ['11025', '22050', '44100', '48000'],
      title: 'Sound Output Sample Rate',
    },
    {
      name: 'wswan_sound_low_pass',
      options: ['disabled', 'enabled'],
      title: 'Audio Filter',
    },
  ],
  mgba: [
    {
      name: 'mgba_solar_sensor_level',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      title: 'Solar Sensor Level',
    },
    {
      name: 'mgba_allow_opposing_directions',
      options: ['no', 'yes'],
      title: 'Allow Opposing Directional Input',
    },
    {
      name: 'mgba_gb_model',
      options: ['Autodetect', 'Game Boy', 'Super Game Boy', 'Game Boy Color', 'Game Boy Advance'],
      title: 'Game Boy Model',
    },
    {
      name: 'mgba_force_gbp',
      options: ['OFF', 'ON'],
      title: 'Game Boy Player Rumble',
    },
    {
      name: 'mgba_idle_optimization',
      options: ['Remove Known', 'Detect and Remove', "Don't Remove"],
      title: 'Idle Loop Removal',
    },
    {
      name: 'mgba_frameskip',
      options: ['disabled', 'auto', 'auto_threshold', 'fixed_interval'],
      title: 'Frameskip',
    },
    {
      defaultOption: '33',
      name: 'mgba_frameskip_threshold',
      options: ['15', '18', '21', '24', '27', '30', '33', '36', '39', '42', '45', '48', '51', '54', '57', '60'],
      title: 'Frameskip Threshold (%)',
    },
    {
      name: 'mgba_frameskip_interval',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      title: 'Frameskip Interval',
    },
    {
      name: 'mgba_use_bios',
      options: ['ON', 'OFF'],
      title: 'Use BIOS File if Found',
    },
    {
      name: 'mgba_skip_bios',
      options: ['OFF', 'ON'],
      title: 'Skip BIOS Intro',
    },
    {
      name: 'mgba_gb_colors_preset',
      options: ['0', '1', '2', '3'],
      title: 'Hardware Preset Game Boy Palettes',
    },
    {
      name: 'mgba_sgb_borders',
      options: ['ON', 'OFF'],
      title: 'Use Super Game Boy Borders',
    },
    {
      name: 'mgba_color_correction',
      options: ['OFF', 'GBA', 'GBC', 'Auto'],
      title: 'Color Correction',
    },
    {
      name: 'mgba_interframe_blending',
      options: ['OFF', 'mix', 'mix_smart', 'lcd_ghosting', 'lcd_ghosting_fast'],
      title: 'Interframe Blending',
    },
  ],
  nestopia: [
    {
      name: 'nestopia_blargg_ntsc_filter',
      options: ['disabled', 'composite', 'svideo', 'rgb', 'monochrome'],
      title: 'Blargg NTSC filter',
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
      title: 'Palette',
    },
    {
      name: 'nestopia_nospritelimit',
      options: ['disabled', 'enabled'],
      title: 'Remove Sprite Limit',
    },
    {
      name: 'nestopia_overclock',
      options: ['1x', '2x'],
      title: 'CPU Speed (Overclock)',
    },
    {
      name: 'nestopia_fds_auto_insert',
      options: ['enabled', 'disabled'],
      title: 'FDS Auto Insntert',
    },
    {
      name: 'nestopia_overscan_v',
      options: ['enabled', 'disabled'],
      title: 'Mask Overscan (Vertical)',
    },
    {
      name: 'nestopia_overscan_h',
      options: ['disabled', 'enabled'],
      title: 'Mask Overscan (Horizontal)',
    },
    {
      name: 'nestopia_aspect',
      options: ['auto', 'ntsc', 'pal', '4:3'],
      title: 'Preferred aspect ratio',
    },
    {
      name: 'nestopia_favored_system',
      options: ['auto', 'ntsc', 'pal', 'famicom', 'dendy'],
      title: 'System Region',
    },
    {
      name: 'nestopia_ram_power_state',
      options: ['0x00', '0xFF', 'random'],
      title: 'RAM Power-on State',
    },
    {
      name: 'nestopia_turbo_pulse',
      options: ['2', '3', '4', '5', '6', '7', '8', '9'],
      title: 'Turbo Pulse Speed',
    },
  ],
  picodrive: [
    {
      name: 'picodrive_region',
      options: ['Auto', 'Japan NTSC', 'Japan PAL', 'US', 'Europe'],
      title: 'System Region',
    },
    {
      name: 'picodrive_smstype',
      options: ['Auto', 'Game Gear', 'Master System', 'SG-1000', 'SC-3000'],
      title: 'Master System Type',
    },
    {
      name: 'picodrive_smsmapper',
      options: [
        'Auto',
        'Sega',
        'Codemasters',
        'Korea',
        'Korea MSX',
        'Korea X-in-1',
        'Korea 4-Pak',
        'Korea Janggun',
        'Korea Nemesis',
        'Taiwan 8K RAM',
      ],
      title: 'Master System ROM Mapping',
    },
    {
      name: 'picodrive_smstms',
      options: ['SMS', 'SG-1000'],
      title: 'Master System Palette in TMS modes',
    },
    {
      name: 'picodrive_ramcart',
      options: ['disabled', 'enabled'],
      title: 'Sega CD RAM Cart',
    },
    {
      name: 'picodrive_aspect',
      options: ['PAR', '4/3', 'CRT'],
      title: 'Core-Provided Aspect Ratio',
    },
    {
      name: 'picodrive_ggghost',
      options: ['off', 'weak', 'normal'],
      title: 'LCD Ghosting Filter',
    },
    {
      name: 'picodrive_renderer',
      options: ['accurate', 'good', 'fast'],
      title: 'Video Renderer',
    },
    {
      name: 'picodrive_sound_rate',
      options: ['16000', '22050', '32000', '44100', 'native'],
      title: 'Audio Sample Rate (Hz)',
    },
    {
      name: 'picodrive_fm_filter',
      options: ['off', 'on'],
      title: 'FM filtering',
    },
    {
      name: 'picodrive_smsfm',
      options: ['off', 'on'],
      title: 'Master System FM Sound Unit',
    },
    {
      name: 'picodrive_dacnoise',
      options: ['off', 'on'],
      title: 'Mega Drive FM DAC noise',
    },
    {
      name: 'picodrive_input1',
      options: ['3 button pad', '6 button pad', 'team player', '4way play', 'None'],
      title: 'Input Device 1',
    },
    {
      name: 'picodrive_input2',
      options: ['3 button pad', '6 button pad', 'team player', '4way play', 'None'],
      title: 'Input Device 2',
    },
    {
      name: 'picodrive_drc',
      options: ['enabled', 'disabled'],
      title: 'Dynamic Recompilers',
    },
    {
      name: 'picodrive_frameskip',
      options: ['disabled', 'auto', 'manual'],
      title: 'Frameskip',
    },
    {
      defaultOption: '33',
      name: 'picodrive_frameskip_threshold',
      options: ['15', '18', '21', '24', '27', '30', '33', '36', '39', '42', '45', '48', '51', '54', '57', '60'],
      title: 'Frameskip Threshold (%)',
    },
    {
      name: 'picodrive_sprlim',
      options: ['disabled', 'enabled'],
      title: 'No Sprite Limit',
    },
    {
      name: 'picodrive_overclk68k',
      options: ['disabled', '+25%', '+50%', '+75%', '+100%', '+200%', '+400%'],
      title: '68K Overclock',
    },
  ],
  prosystem: [
    {
      name: 'prosystem_color_depth',
      options: ['16bit', '24bit'],
      title: 'Color Depth',
    },
    {
      name: 'prosystem_gamepad_dual_stick_hack',
      options: ['disabled', 'enabled'],
      title: 'Dual Stick Controller',
    },
  ],
  quicknes: [
    { name: 'quicknes_up_down_allowed', options: ['disabled', 'enabled'], title: 'Allow Opposing Directions' },
    { name: 'quicknes_aspect_ratio_par', options: ['PAR', '4:3'], title: 'Aspect ratio' },
    { name: 'quicknes_use_overscan_h', options: ['enabled', 'disabled'], title: 'Show horizontal overscan' },
    { name: 'quicknes_use_overscan_v', options: ['disabled', 'enabled'], title: 'Show vertical overscan' },
    { name: 'quicknes_no_sprite_limit', options: ['enabled', 'disabled'], title: 'No sprite limit' },
    {
      name: 'quicknes_audio_nonlinear',
      options: ['nonlinear', 'linear', 'stereo panning'],
      title: 'Audio mode',
    },
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
      title: 'Color Palette',
    },
  ],
  snes9x: [
    { name: 'snes9x_up_down_allowed', options: ['disabled', 'enabled'], title: 'Allow Opposing Directions' },
    { name: 'snes9x_region', options: ['auto', 'ntsc', 'pal'], title: 'Console region (Reload core)' },
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
      title: 'SuperFX Frequency',
    },
    {
      name: 'snes9x_overclock_cycles',
      options: ['disabled', 'light', 'compatible', 'max'],
      title: 'Reduce Slowdown (Hack, Unsafe)',
    },
    {
      name: 'snes9x_reduce_sprite_flicker',
      options: ['disabled', 'enabled'],
      title: 'Reduce Flickering (Hack, Unsafe)',
    },
    {
      name: 'snes9x_randomize_memory',
      options: ['disabled', 'enabled'],
      title: 'Randomize Memory (Unsafe)',
    },
    {
      name: 'snes9x_hires_blend',
      options: ['disabled', 'merge', 'blur'],
      title: 'Hires Blending',
    },
    {
      name: 'snes9x_blargg',
      options: ['disabled', 'monochrome', 'rf', 'composite', 's-video', 'rgb'],
      title: 'Blargg NTSC filter',
    },
    { name: 'snes9x_overscan', options: ['enabled', 'disabled', 'auto'], title: 'Crop overscan' },
    { name: 'snes9x_aspect', options: ['4:3', 'uncorrected', 'auto', 'ntsc', 'pal'], title: 'Preferred aspect ratio' },
    {
      defaultOption: '2',
      name: 'snes9x_superscope_crosshair',
      options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
      title: 'Super Scope crosshair',
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
      title: 'Super Scope color',
    },
    {
      name: 'snes9x_block_invalid_vram_access',
      options: ['enabled', 'disabled'],
    },
  ],
  stella2014: [
    { name: 'stella2014_color_depth', options: ['16bit', '24bit'], title: 'Color Depth' },
    {
      name: 'stella2014_mix_frames',
      options: ['disabled', 'mix', 'ghost_65', 'ghost_75', 'ghost_85', 'ghost_95'],
      title: 'Interframe Blending',
    },
    {
      name: 'stella2014_paddle_analog_response',
      options: ['linear', 'quadratic'],
      title: 'Gamepad: Paddle Response (Analog)',
    },
    {
      defaultOption: '15',
      name: 'stella2014_paddle_analog_deadzone',
      options: ['0', '3', '6', '9', '12', '15', '18', '21', '24', '27', '30'],
      title: 'Gamepad: Paddle Deadzone (Analog)',
    },
    {
      defaultOption: '20',
      name: 'stella2014_stelladaptor_analog_sensitivity',
      options: range(30).map((n) => `${n}`),
      title: 'Stelladaptor: Paddle Sensitivity',
    },
    {
      defaultOption: '0',
      name: 'stella2014_stelladaptor_analog_center',
      options: range(-10, 30).map((n) => `${n}`),
      title: 'Stelladaptor: Paddle Centre Offset',
    },
  ],
  vba_next: [
    { name: 'vbanext_bios', options: ['enabled', 'disabled'], title: 'Use BIOS if available' },
    { name: 'vbanext_rtc', options: ['auto', 'enabled'], title: 'Force Enable RTC' },
  ],
}
