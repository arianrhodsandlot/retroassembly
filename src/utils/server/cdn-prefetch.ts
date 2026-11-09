import { attemptAsync } from 'es-toolkit'
import { platformMap } from '#@/constants/platform.ts'
import { shaders } from '#@/pages/library/components/library-layout/layout-menu/settings-dialog/emulating-settings/shaders.ts'
import { getCDNUrl, isCDNCacheEnabled } from '#@/utils/isomorphic/cdn.ts'
import { getCoreUrl, getShaderUrls } from '#@/utils/isomorphic/emulator-files.ts'
import { fonts, getFontUrl } from '#@/utils/isomorphic/fonts.ts'
import { getCachedFile, resolveCDNCacheTarget } from './cdn-cache.ts'

const categories = ['cores', 'shaders', 'assets'] as const
type Category = (typeof categories)[number]

const concurrency = 4

function toUpstreamUrl(url: string) {
  return url.startsWith('/cdn/') ? resolveCDNCacheTarget(url.slice('/cdn/'.length))?.url : url
}

function getPrefetchUrls(selected: Set<Category>) {
  const urls = new Set<string>()
  if (selected.has('cores')) {
    for (const { cores } of Object.values(platformMap)) {
      for (const core of cores) {
        urls.add(getCoreUrl(core))
      }
    }
  }
  if (selected.has('shaders')) {
    for (const { id, thumbnail } of shaders) {
      for (const url of [...getShaderUrls(id), thumbnail]) {
        urls.add(url)
      }
    }
  }
  if (selected.has('assets')) {
    for (const { path } of fonts) {
      urls.add(getFontUrl(path))
    }
    for (const platform of Object.keys(platformMap)) {
      for (const file of [
        `platforms/icons/${platform}.png`,
        `platforms/contents/${platform}.svg`,
        `platforms/logos/${platform}.svg`,
        `platforms/photos/${platform}.png`,
        `platforms/backgrounds/${platform}.png`,
        `platforms/blured-backgrounds/${platform}.jpg`,
      ]) {
        urls.add(getCDNUrl('arianrhodsandlot/retroassembly-assets', file))
      }
    }
  }
  return [...urls].map((url) => toUpstreamUrl(url)).filter(Boolean) as string[]
}

/**
 * Downloads files into the CDN cache ahead of time, so they are available without internet access.
 * `value` is `all`, or a comma-separated list of `cores`, `shaders` and `assets`.
 */
export async function prefetchCDNCache(value: string) {
  const requested = new Set(value.split(',').map((category) => category.trim()))
  const selected = new Set<Category>(
    requested.has('all') ? categories : categories.filter((category) => requested.has(category)),
  )
  const urls = getPrefetchUrls(selected)
  const counts = { cached: 0, failed: 0, missing: 0 }

  const queue = [...urls]
  async function worker() {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const [error, cached] = await attemptAsync(() => getCachedFile(url))
      if (error) {
        counts.failed += 1
      } else if (cached?.status === 200) {
        counts.cached += 1
      } else {
        counts.missing += 1
      }
    }
  }
  console.info(`Prefetching ${urls.length} CDN files (${[...selected].join(', ')})...`)
  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  console.info(
    `Prefetched CDN files: ${counts.cached} cached, ${counts.missing} not found upstream, ${counts.failed} failed`,
  )
  return counts
}

/** Starts the prefetch configured by `RETROASSEMBLY_RUN_TIME_CDN_PREFETCH` in the background. */
export function startCDNCachePrefetch() {
  const value = process.env.RETROASSEMBLY_RUN_TIME_CDN_PREFETCH
  if (!value) {
    return
  }
  if (!isCDNCacheEnabled()) {
    console.warn('RETROASSEMBLY_RUN_TIME_CDN_PREFETCH is ignored unless RETROASSEMBLY_RUN_TIME_CDN_CACHE=true')
    return
  }
  ;(async () => {
    const [error] = await attemptAsync(() => prefetchCDNCache(value))
    if (error) {
      console.warn('Failed to prefetch CDN files', error)
    }
  })()
}
