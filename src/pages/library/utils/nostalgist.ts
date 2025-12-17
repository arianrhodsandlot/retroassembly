import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import { isBrowser } from 'es-toolkit'
import { Nostalgist } from 'nostalgist'
import { cdnHost } from '#@/utils/isomorphic/cdn.ts'

const extractCache = new Map<string, ReturnType<typeof extractCore>>()

function getCoreCDNUrl(core: string) {
  const externalCores = ['a5200', 'prosystem', 'stella2014']
  const segments = externalCores.includes(core)
    ? [
        'npm',
        ['retroassembly-custom-cores', '1.22.2-20251119172557'].join('@'),
        'dist',
        'cores',
        `${core}_libretro.zip`,
      ]
    : ['gh', ['arianrhodsandlot/retroarch-emscripten-build', 'v1.22.2'].join('@'), 'retroarch', `${core}_libretro.zip`]
  const path = segments.join('/')
  return new URL(path, cdnHost)
}

async function extractCore(core: string) {
  const url = getCoreCDNUrl(core)
  const response = await fetch(url)
  const blob = await response.blob()
  const zipFileReader = new BlobReader(blob)
  const zipReader = new ZipReader(zipFileReader)
  const entries = await zipReader.getEntries()
  const result: { js?: Blob; wasm?: Blob } = {}
  await Promise.all(
    entries.map(async (entry) => {
      if (entry && !entry.directory) {
        if (entry.filename.endsWith('.js')) {
          result.js = await entry.getData?.(new BlobWriter('application/octet-stream'))
        } else if (entry.filename.endsWith('.wasm')) {
          result.wasm = await entry.getData?.(new BlobWriter('application/octet-stream'))
        }
      }
    }),
  )
  if (!result.js || !result.wasm) {
    throw new Error(`Failed to extract core files for ${core}`)
  }
  return result as { js: Blob; wasm: Blob }
}

async function extractCoreWithCache(core: string) {
  if (extractCache.has(core)) {
    return extractCache.get(core) as ReturnType<typeof extractCore>
  }
  const promise = extractCore(core)
  extractCache.set(core, promise)
  const result = await promise
  extractCache.delete(core)
  return result
}

const style: Partial<CSSStyleDeclaration> = {
  backgroundPosition: ['left center', 'right center'].join(','),
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  border: 'none',
  cursor: 'none',
  opacity: '0',
  outline: 'none',
  transition: 'opacity .1s',
}

if (isBrowser()) {
  Nostalgist.configure({
    cache: true,
    async resolveCoreJs(core) {
      if (typeof core !== 'string') {
        throw new TypeError('Invalid core js file')
      }
      const response = await extractCoreWithCache(core)
      return response.js
    },
    async resolveCoreWasm(core) {
      if (typeof core !== 'string') {
        throw new TypeError('Invalid core js file')
      }
      const response = await extractCoreWithCache(core)
      return response.wasm
    },
    resolveShader(name) {
      if (!name) {
        return []
      }
      const cdnBaseUrl = 'https://cdn.jsdelivr.net/gh'
      const shaderRepo = 'libretro/glsl-shaders'
      const shaderVersion = '468f67b6f6788e2719d1dd28dfb2c9b7c3db3cc7'
      const prefix = `${cdnBaseUrl}/${shaderRepo}@${shaderVersion}`

      const preset = `${prefix}/${name}.glslp`

      const { path } = Nostalgist.vendors
      const segments = name.split(path.sep)
      segments.splice(-1, 0, 'shaders')
      const glsls = {
        'crt/crt-hyllian': [`${prefix}/crt/shaders/zfast_crt.glsl`],
        'crt/zfast-crt': [`${prefix}/crt/shaders/zfast_crt.glsl`],
        'deblur/sedi': [`${prefix}/deblur/shaders/sedi-v1.0.glsl`],
        'handheld/gba-color': [`${prefix}/handheld/shaders/color/gba-color.glsl`],
        'handheld/vba-color': [`${prefix}/handheld/shaders/color/vba-color.glsl`],
        'handheld/zfast-lcd': [`${prefix}/handheld/shaders/zfast_lcd.glsl`],
        'sabr/sabr': [`${prefix}/sabr/shaders/sabr-v3.0.glsl`],
      }[name] || [`${prefix}/${segments.join(path.sep)}.glsl`]

      return [preset, ...glsls]
    },
    style,
  })
}
