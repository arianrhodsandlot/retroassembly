import { getCDNUrl } from '#@/utils/isomorphic/cdn.ts'

function getShaderThumbnail(shader: string) {
  return getCDNUrl('libretro/docs', `/docs/image/shader/${shader}.png`)
}

export const shaders = [
  { id: '', name: 'disabled', thumbnail: '' },
  { id: 'anti-aliasing/fxaa', name: 'fxaa', thumbnail: getShaderThumbnail('antialiasing/fxaa') },
  { id: 'crt/crt-aperture', name: 'crt-aperture', thumbnail: getShaderThumbnail('crt/crt-aperture') },
  { id: 'crt/crt-cgwg-fast', name: 'crt-cgwg-fast', thumbnail: getShaderThumbnail('crt/crt-cgwg-fast') },
  { id: 'crt/crt-easymode', name: 'crt-easymode', thumbnail: getShaderThumbnail('crt/crt-easymode') },
  { id: 'crt/crt-geom', name: 'crt-geom', thumbnail: getShaderThumbnail('crt/crt-geom') },
  { id: 'crt/crt-lottes', name: 'crt-lottes', thumbnail: getShaderThumbnail('crt/crt-lottes') },
  { id: 'crt/crt-mattias', name: 'crt-mattias', thumbnail: '' },
  { id: 'crt/crt-nes-mini', name: 'crt-nes-mini', thumbnail: getShaderThumbnail('crt/crt-nes-mini') },
  { id: 'crt/crt-nobody', name: 'crt-nobody', thumbnail: '' },
  { id: 'crt/crt-pi-vertical', name: 'crt-pi-vertical', thumbnail: '' },
  { id: 'crt/crt-pi', name: 'crt-pi', thumbnail: '' },
  { id: 'crt/fakelottes', name: 'fakelottes', thumbnail: '' },
  { id: 'crt/smuberstep-glow', name: 'smuberstep-glow', thumbnail: '' },
  { id: 'crt/yee64', name: 'yee64', thumbnail: getShaderThumbnail('crt/yee64') },
  { id: 'crt/zfast_crt_geo_svideo', name: 'zfast_crt_geo_svideo', thumbnail: '' },
  { id: 'crt/zfast_crt_geo', name: 'zfast_crt_geo', thumbnail: '' },
  { id: 'crt/zfast_crt_nogeo_svideo', name: 'zfast_crt_nogeo_svideo', thumbnail: '' },
  { id: 'crt/zfast_crt_nogeo', name: 'zfast_crt_nogeo', thumbnail: '' },
  { id: 'crt/zfast-crt', name: 'zfast-crt', thumbnail: getShaderThumbnail('crt/zfast-crt') },
  { id: 'cubic/bicubic', name: 'bicubic', thumbnail: '' },
  { id: 'cubic/catmull-rom', name: 'catmull-rom', thumbnail: '' },
  { id: 'ddt/ddt', name: 'ddt', thumbnail: getShaderThumbnail('ddt/ddt') },
  { id: 'deblur/sedi', name: 'sedi', thumbnail: '' },
  { id: 'handheld/bevel', name: 'bevel', thumbnail: getShaderThumbnail('retro/bevel') },
  { id: 'handheld/dot', name: 'dot', thumbnail: getShaderThumbnail('handheld/dot') },
  { id: 'handheld/gba-color', name: 'gba-color', thumbnail: getShaderThumbnail('handheld/gba-color') },
  { id: 'handheld/lcd1x', name: 'lcd1x', thumbnail: '' },
  { id: 'handheld/lcd3x', name: 'lcd3x', thumbnail: '' },
  { id: 'handheld/lcd3x', name: 'lcd3x', thumbnail: getShaderThumbnail('handheld/lcd-3x') },
  { id: 'handheld/vba-color', name: 'vba-color', thumbnail: getShaderThumbnail('handheld/vba-color') },
  { id: 'handheld/zfast-lcd', name: 'zfast-lcd', thumbnail: '' },
  { id: 'interpolation/pixel_art_AA', name: 'pixel_art_AA', thumbnail: '' },
  { id: 'sabr/sabr', name: 'sabr', thumbnail: getShaderThumbnail('sabr/sabr') },
  { id: 'xbrz/xbrz-freescale', name: 'xbrz-freescale', thumbnail: getShaderThumbnail('xbrz/4xbrz') },
]
