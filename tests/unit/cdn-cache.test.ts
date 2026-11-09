import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import { setTimeout } from 'node:timers/promises'
import { Hono } from 'hono'
import { cdnCache } from '#@/middlewares/cdn-cache.ts'
import { getCDNUrl, toCDNCacheUrl } from '#@/utils/isomorphic/cdn.ts'
import { getCoreUrl, getShaderUrls } from '#@/utils/isomorphic/emulator-files.ts'
import { getCachedFile, resolveCDNCacheTarget } from '#@/utils/server/cdn-cache.ts'

const dataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'retroassembly-cdn-cache-'))
const assetsPath = 'jsdelivr/gh/arianrhodsandlot/retroassembly-assets@feab5bc8061c36cf9ad01c35b36ab721c3929ca3'

async function getStatus(app: Hono, url: string) {
  const response = await app.request(url)
  return response.status
}

async function getCachedStatus(url: string) {
  const cached = await getCachedFile(url)
  return cached?.status
}

function createApp({ loggedIn = false } = {}) {
  return new Hono()
    .use(async (c, next) => {
      if (loggedIn) {
        // @ts-expect-error -- only the presence of a user matters here
        c.set('currentUser', { id: 'user' })
      }
      await next()
    })
    .get('/cdn/*', cdnCache())
    .get('*', (c) => c.text('page', 404))
}

await describe('CDN cache', async () => {
  before(() => {
    process.env.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY = dataDirectory
    process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE = 'true'
  })

  after(() => {
    delete process.env.RETROASSEMBLY_RUN_TIME_DATA_DIRECTORY
    delete process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE
    fs.rmSync(dataDirectory, { force: true, recursive: true })
  })

  await it('rewrites CDN URLs to the cache route only when enabled', () => {
    const coreUrl = getCoreUrl('fceumm')
    assert.equal(
      toCDNCacheUrl(coreUrl),
      '/cdn/jsdelivr/gh/arianrhodsandlot/retroarch-emscripten-build@v1.22.2-1/retroarch/fceumm_libretro.zip',
    )
    assert.equal(
      toCDNCacheUrl('https://thumbnails.libretro.com/Nintendo - Nintendo 64/Named_Boxarts/a.png'),
      '/cdn/libretro-thumbnails/Nintendo - Nintendo 64/Named_Boxarts/a.png',
    )
    assert.equal(toCDNCacheUrl('https://example.com/a.png'), 'https://example.com/a.png')
    assert.ok(getCDNUrl('arianrhodsandlot/retroassembly-assets', 'a.png').startsWith('/cdn/jsdelivr/gh/'))

    process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE = 'false'
    assert.equal(toCDNCacheUrl(coreUrl), coreUrl)
    process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE = 'true'
  })

  await it('only resolves files RetroAssembly loads', () => {
    const allowed = [
      `${assetsPath}/platforms/icons/nes.png`,
      'jsdelivr/gh/arianrhodsandlot/retroarch-emscripten-build@v1.22.2-1/retroarch/fceumm_libretro.zip',
      'jsdelivr/npm/retroassembly-custom-cores@1.22.2-20260719172358/dist/cores/a5200_libretro.zip',
      'jsdelivr/gh/libretro/glsl-shaders@468f67b6f6788e2719d1dd28dfb2c9b7c3db3cc7/crt/crt-geom.glslp',
      'jsdelivr/fontsource/fonts/inter:vf@5.2.8/latin-wght-normal.woff2',
    ]
    for (const cachePath of allowed) {
      assert.equal(resolveCDNCacheTarget(cachePath)?.requiresLogin, false, cachePath)
    }

    const thumbnails = [
      'libretro-thumbnails/Nintendo%20-%20Nintendo%2064/Named_Boxarts/a.png',
      'jsdelivr/gh/libretro-thumbnails/Nintendo_-_Nintendo_64/Named_Boxarts/a.png',
    ]
    for (const cachePath of thumbnails) {
      assert.equal(resolveCDNCacheTarget(cachePath)?.requiresLogin, true, cachePath)
    }

    const rejected = [
      'jsdelivr/gh/arianrhodsandlot/retroassembly-assets@main/platforms/icons/nes.png',
      'jsdelivr/gh/someone/else@v1/x.js',
      'jsdelivr/npm/left-pad@1.3.0/index.js',
      'jsdelivr/fontsource/fonts/comic-neue@5.0.0/latin-400-normal.woff2',
      `${assetsPath}/../../someone/else@v1/x.js`,
      `${assetsPath}/%2e%2e/%2e%2e/someone/else@v1/x.js`,
      'jsdelivr//example.com/x',
      'evil/x',
      'jsdelivr',
    ]
    for (const cachePath of rejected) {
      assert.equal(resolveCDNCacheTarget(cachePath), undefined, cachePath)
    }
  })

  await it('matches the shader files the emulator expects', () => {
    const prefix = 'https://cdn.jsdelivr.net/gh/libretro/glsl-shaders@468f67b6f6788e2719d1dd28dfb2c9b7c3db3cc7'
    assert.deepEqual(getShaderUrls('crt/crt-geom'), [
      `${prefix}/crt/crt-geom.glslp`,
      `${prefix}/crt/shaders/crt-geom.glsl`,
    ])
    assert.deepEqual(getShaderUrls('crt/zfast-crt'), [
      `${prefix}/crt/zfast-crt.glslp`,
      `${prefix}/crt/shaders/zfast_crt.glsl`,
    ])
    assert.deepEqual(getShaderUrls(''), [])
  })

  await it('downloads a file once, shares concurrent downloads, and serves later requests from disk', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', async () => {
      await setTimeout(20)
      return new Response('core bytes', { headers: { 'Content-Type': 'application/zip' } })
    })
    const url = getCoreUrl('nestopia')
    const [first, second] = await Promise.all([getCachedFile(url), getCachedFile(url)])
    assert.equal(fetchMock.mock.callCount(), 1)
    assert.equal(first?.status, 200)
    assert.equal(second?.path, first?.path)
    assert.equal(fs.readFileSync(first?.path || '', 'utf8'), 'core bytes')

    const third = await getCachedFile(url)
    assert.equal(fetchMock.mock.callCount(), 1)
    assert.equal(third?.contentType, 'application/zip')
  })

  await it('remembers missing files, and caches nothing when the CDN fails', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', () => Promise.resolve(new Response('', { status: 404 })))
    const missing = 'https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@x/missing.png'
    assert.equal(await getCachedStatus(missing), 404)
    assert.equal(await getCachedStatus(missing), 404)
    assert.equal(fetchMock.mock.callCount(), 1)

    fetchMock.mock.mockImplementation(() => Promise.resolve(new Response('', { status: 503 })))
    const failing = 'https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@x/failing.png'
    await assert.rejects(getCachedFile(failing))
    assert.ok(fs.readdirSync(path.join(dataDirectory, 'cache', 'cdn')).every((name) => !name.endsWith('.partial')))
  })

  await it('serves cached files through the route, and checks the allowlist and login first', async (t) => {
    const fetchMock = t.mock.method(globalThis, 'fetch', () =>
      Promise.resolve(new Response('png', { headers: { 'Content-Type': 'image/png' } })),
    )
    const response = await createApp().request(`/cdn/${assetsPath}/platforms/icons/snes.png`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Content-Type'), 'image/png')
    assert.equal(await response.text(), 'png')

    assert.equal(await getStatus(createApp(), '/cdn/jsdelivr/gh/someone/else@v1/x.js'), 404)
    const thumbnail = '/cdn/libretro-thumbnails/Nintendo%20-%20Nintendo%2064/Named_Boxarts/a.png'
    assert.equal(await getStatus(createApp(), thumbnail), 401)
    assert.equal(await getStatus(createApp({ loggedIn: true }), thumbnail), 200)
    assert.equal(fetchMock.mock.callCount(), 2)

    fetchMock.mock.mockImplementation(() => Promise.reject(new Error('offline')))
    assert.equal(await getStatus(createApp(), `/cdn/${assetsPath}/platforms/icons/gba.png`), 502)
  })

  await it('leaves /cdn/ to the rest of the app when disabled', async () => {
    process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE = 'false'
    const response = await createApp().request(`/cdn/${assetsPath}/platforms/icons/nes.png`)
    assert.equal(await response.text(), 'page')
    process.env.RETROASSEMBLY_RUN_TIME_CDN_CACHE = 'true'
  })
})
