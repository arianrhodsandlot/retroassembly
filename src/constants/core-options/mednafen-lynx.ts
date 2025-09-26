import type { CoreOption } from './types.d.ts'

export const mednafenLynxOptions: CoreOption[] = [
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
]
