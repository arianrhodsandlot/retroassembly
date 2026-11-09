import { cdnHost } from './cdn.ts'

const customCores = new Set(['a5200', 'mupen64plus_next', 'prosystem', 'stella2014'])

export function getCoreUrl(core: string) {
  const segments = customCores.has(core)
    ? [
        'npm',
        ['retroassembly-custom-cores', '1.22.2-20260719172358'].join('@'),
        'dist',
        'cores',
        `${core}_libretro.zip`,
      ]
    : [
        'gh',
        ['arianrhodsandlot/retroarch-emscripten-build', 'v1.22.2-1'].join('@'),
        'retroarch',
        `${core}_libretro.zip`,
      ]
  return new URL(segments.join('/'), cdnHost).href
}

const shaderPrefix = new URL('gh/libretro/glsl-shaders@468f67b6f6788e2719d1dd28dfb2c9b7c3db3cc7', cdnHost).href

const shaderFiles: Record<string, string[]> = {
  'crt/crt-easymode-halation': [
    'crt/shaders/crt-easymode-halation/linearize.glsl',
    'crt/shaders/crt-easymode-halation/blur_horiz.glsl',
    'crt/shaders/crt-easymode-halation/blur_vert.glsl',
    'crt/shaders/crt-easymode-halation/threshold.glsl',
    'crt/shaders/crt-easymode-halation/crt-easymode-halation.glsl',
  ],
  'crt/crt-hyllian': ['crt/shaders/zfast_crt.glsl'],
  'crt/crt-interlaced-halation': [
    'crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass0.glsl',
    'crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass1.glsl',
    'crt/shaders/crt-interlaced-halation/crt-interlaced-halation-pass2.glsl',
    'interpolation/shaders/quilez.glsl',
  ],
  'crt/zfast-crt': ['crt/shaders/zfast_crt.glsl'],
  'deblur/sedi': ['deblur/shaders/sedi-v1.0.glsl'],
  'handheld/gba-color': ['handheld/shaders/color/gba-color.glsl'],
  'handheld/vba-color': ['handheld/shaders/color/vba-color.glsl'],
  'handheld/zfast-lcd': ['handheld/shaders/zfast_lcd.glsl'],
  'sabr/sabr': ['sabr/shaders/sabr-v3.0.glsl'],
}

/** The preset followed by the shader files for a shader from libretro/glsl-shaders, e.g. `crt/crt-geom`. */
export function getShaderUrls(name?: string) {
  if (!name) {
    return []
  }
  const segments = name.split('/')
  segments.splice(-1, 0, 'shaders')
  const files = shaderFiles[name] || [`${segments.join('/')}.glsl`]
  return [`${name}.glslp`, ...files].map((file) => `${shaderPrefix}/${file}`)
}
