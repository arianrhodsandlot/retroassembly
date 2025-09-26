import type { CoreOption } from './types.d.ts'

export const handyOptions: CoreOption[] = [
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
]
