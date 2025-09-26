import type { CoreOption } from './types.d.ts'

export const a5200Options: CoreOption[] = [
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
]
