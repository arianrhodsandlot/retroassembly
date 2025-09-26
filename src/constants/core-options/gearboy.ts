import type { CoreOption } from './types.d.ts'

export const gearboyOptions: CoreOption[] = [
  { name: 'gearboy_model', options: ['Auto', 'Game Boy DMG'], title: 'Emulated Model' },
  { name: 'gearboy_palette', options: ['Original', 'Sharp', 'B/W', 'Autumn', 'Soft', 'Slime'], title: 'Palette' },
  { name: 'gearboy_up_down_allowed', options: ['Disabled', 'Enabled'], title: 'Allow Up+Down / Left+Right' },
]
