import { range } from 'es-toolkit'
import type { CoreOption } from './types.d.ts'

export const stella2014Options: CoreOption[] = [
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
]
