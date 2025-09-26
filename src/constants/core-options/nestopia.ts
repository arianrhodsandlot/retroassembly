import type { CoreOption } from './types.d.ts'

export const nestopiaOptions: CoreOption[] = [
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
]
