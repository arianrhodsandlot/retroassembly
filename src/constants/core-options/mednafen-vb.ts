import type { CoreOption } from './types.d.ts'

export const mednafenVbOptions: CoreOption[] = [
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
]
