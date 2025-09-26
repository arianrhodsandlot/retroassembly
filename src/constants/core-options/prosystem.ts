import type { CoreOption } from './types.d.ts'

export const prosystemOptions: CoreOption[] = [
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
]
