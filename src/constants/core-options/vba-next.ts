import type { CoreOption } from './types.d.ts'

export const vbaNextOptions: CoreOption[] = [
  { name: 'vbanext_bios', options: ['enabled', 'disabled'], title: 'Use BIOS if available' },
  { name: 'vbanext_rtc', options: ['auto', 'enabled'], title: 'Force Enable RTC' },
]
