import type { CoreOption } from './types.d.ts'

export const quicknesOptions: CoreOption[] = [
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
]
