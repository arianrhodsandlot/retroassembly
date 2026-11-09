import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import { isBrowser } from 'es-toolkit'
import { Nostalgist } from 'nostalgist'
import { toCDNCacheUrl } from '#@/utils/isomorphic/cdn.ts'
import { getCoreUrl, getShaderUrls } from '#@/utils/isomorphic/emulator-files.ts'

const extractCache = new Map<string, ReturnType<typeof extractCore>>()

async function extractCore(core: string) {
  const url = toCDNCacheUrl(getCoreUrl(core))
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
  const { path } = Nostalgist.vendors
  Nostalgist.configure({
    beforeLaunch(nostalgist) {
      const FS = nostalgist.getEmscriptenFS()
      const options = nostalgist.getOptions()
      const shadersDirectory = '/home/web_user/retroarch/bundle/shaders/shaders_glsl/shaders'
      switch (options.shader) {
        case 'crt/crt-easymode-halation':
          FS.mkdirTree(path.join(shadersDirectory, 'crt-easymode-halation'))
          for (const name of ['linearize', 'blur_horiz', 'blur_vert', 'threshold', 'crt-easymode-halation']) {
            FS.rename(
              path.join(shadersDirectory, `${name}.glsl`),
              path.join(shadersDirectory, 'crt-easymode-halation', `${name}.glsl`),
            )
          }

          break

        case 'crt/crt-interlaced-halation':
          FS.mkdirTree(path.join(shadersDirectory, 'crt-interlaced-halation'))
          for (const n of [0, 1, 2]) {
            FS.rename(
              path.join(shadersDirectory, `crt-interlaced-halation-pass${n}.glsl`),
              path.join(shadersDirectory, 'crt-interlaced-halation', `crt-interlaced-halation-pass${n}.glsl`),
            )
          }
          FS.mkdirTree('/home/web_user/retroarch/bundle/shaders/interpolation/shaders')
          FS.rename(
            path.join(shadersDirectory, 'quilez.glsl'),
            path.join('/home/web_user/retroarch/bundle/shaders/interpolation/shaders/quilez.glsl'),
          )

          break
      }
    },
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
      return getShaderUrls(name).map((url) => toCDNCacheUrl(url))
    },
    style,
  })
}
