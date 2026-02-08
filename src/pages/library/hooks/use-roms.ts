import { useLoaderData } from 'react-router'
import type { loader as FavoritesLoader } from '#@/pages/routes/library-favorites.tsx'
import type { loader as HistoryLoader } from '#@/pages/routes/library-history.tsx'
import type { loader as PlatformLoader } from '#@/pages/routes/library-platform.tsx'
import type { loader as LibraryLoader } from '#@/pages/routes/library-roms.tsx'

type Loader = typeof FavoritesLoader | typeof HistoryLoader | typeof LibraryLoader | typeof PlatformLoader

export function useRoms() {
  const { roms } = useLoaderData<Loader>()

  return { roms }
}
