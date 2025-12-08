import { getCDNUrl } from '#@/utils/isomorphic/cdn.ts'

function getShaderThumbnail(shader: string) {
  return getCDNUrl('libretro/docs', `/docs/image/shader/${shader}.png`)
}

export const shaders = [
  { id: '', name: 'disabled', thumbnail: '' },
  { id: 'crt/crt-easymode', name: 'crt-easymode', thumbnail: getShaderThumbnail('crt/crt-easymode') },
  { id: 'crt/crt-nes-mini', name: 'crt-nes-mini', thumbnail: getShaderThumbnail('crt/crt-nes-mini') },
  { id: 'crt/crt-geom', name: 'crt-geom', thumbnail: getShaderThumbnail('crt/crt-geom') },
  { id: 'handheld/dot', name: 'dot', thumbnail: getShaderThumbnail('handheld/dot') },
  { id: 'handheld/lcd3x', name: 'lcd3x', thumbnail: getShaderThumbnail('handheld/lcd-3x') },
  { id: 'xbrz/xbrz-freescale', name: 'xbrz-freescale', thumbnail: getShaderThumbnail('xbrz/4xbrz') },
]
