import type { PlatformName } from '#@/constants/platform.ts'

export const skeletonClassnames: Partial<Record<PlatformName, string>> = {
  atari2600: '!aspect-[7/10] !h-full !w-auto',
  channelf: '!aspect-[7/10] !h-full !w-auto',
  colecovision: '!aspect-[18/25] !h-full !w-auto',
  famicom: '!aspect-[25/34] !h-full !w-auto',
  genesis: '!aspect-[7/10] !h-full !w-auto',
  megadrive: '!aspect-[7/10] !h-full !w-auto',
  nes: '!aspect-[25/34] !h-full !w-auto',
  odyssey2: '!aspect-[2/3] !h-full !w-auto',
  sfc: '!aspect-[27/50] !h-full !w-auto',
  sms: '!aspect-[12/17] !h-full !w-auto',
  snes: '!aspect-[7/5] !h-auto !w-full',
  videopac: '!aspect-[2/3] !h-full !w-auto',
  wonderswan: '!aspect-[4/5] !h-full !w-auto',
  wonderswancolor: '!aspect-[7/10] !h-full !w-auto',
}
