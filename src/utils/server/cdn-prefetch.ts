import { eq } from 'drizzle-orm'
import { attemptAsync } from 'es-toolkit'
import { platformMap } from '#@/constants/platform.ts'
import { romTable, statusEnum } from '#@/databases/schema.ts'
import { shaders } from '#@/pages/library/components/library-layout/layout-menu/settings-dialog/emulating-settings/shaders.ts'
import { getCompanyLogoUrls } from '#@/pages/library/platform/components/company-logo.tsx'
import { getCDNUrl, isCDNCacheEnabled } from '#@/utils/isomorphic/cdn.ts'
import { getCoreUrl, getShaderUrls } from '#@/utils/isomorphic/emulator-files.ts'
import { fonts, getFontUrl } from '#@/utils/isomorphic/fonts.ts'
import { getRomLibretroThumbnail, type LibretroThumbnailType } from '#@/utils/isomorphic/libretro-thumbnail.ts'
import { getCachedFile, resolveCDNCacheTarget } from './cdn-cache.ts'
import { createDrizzle } from './drizzle.ts'

// `all` leaves out `thumbnails`: box art and screenshots for every ROM in the library can take several GB
const categories = ['cores', 'shaders', 'assets', 'thumbnails'] as const
const defaultCategories = new Set(['assets', 'cores', 'shaders'])
type Category = (typeof categories)[number]
const thumbnailTypes: LibretroThumbnailType[] = ['boxart', 'title', 'snap', 'logo']

const concurrency = 4

function toUpstreamUrl(url: string) {
  return url.startsWith('/cdn/') ? resolveCDNCacheTarget(url.slice('/cdn/'.length))?.url : url
}

async function getPrefetchUrls(selected: Set<Category>) {
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
    for (const url of getCompanyLogoUrls()) {
      urls.add(url)
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
  if (selected.has('thumbnails')) {
    // The same URLs the library and game pages request, for every ROM of every user
    const { library } = createDrizzle()
    const roms = await library
      .select({ platform: romTable.platform, rawGameMetadata: romTable.rawGameMetadata })
      .from(romTable)
      .where(eq(romTable.status, statusEnum.normal))
    for (const rom of roms) {
      for (const type of thumbnailTypes) {
        urls.add(getRomLibretroThumbnail(rom, type, 'libretro'))
      }
    }
  }
  return [...urls].map((url) => toUpstreamUrl(url)).filter(Boolean) as string[]
}

/**
 * Downloads files into the CDN cache ahead of time, so they are available without internet access.
 * `value` is a comma-separated list of `cores`, `shaders`, `assets` and `thumbnails`; `all` means all but `thumbnails`.
 */
export async function prefetchCDNCache(value: string) {
  const requested = new Set(value.split(',').map((category) => category.trim()))
  const selected = new Set<Category>(
    categories.filter(
      (category) => requested.has(category) || (requested.has('all') && defaultCategories.has(category)),
    ),
  )
  const urls = await getPrefetchUrls(selected)
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
      const done = counts.cached + counts.missing + counts.failed
      if (done % 1000 === 0) {
        console.info(`Prefetched ${done} of ${urls.length} CDN files...`)
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
