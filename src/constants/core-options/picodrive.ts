import type { CoreOption } from './types.d.ts'

export const picodriveOptions: CoreOption[] = [
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
]
