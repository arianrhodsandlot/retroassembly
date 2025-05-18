import { useLoaderData } from 'react-router'
import type { loader as HistoryLoader } from '@/pages/routes/library-history.tsx'
import type { loader as PlatformLoader } from '@/pages/routes/library-platform.tsx'
import type { loader as LibraryLoader } from '@/pages/routes/library.tsx'
import { useClientRoms } from '../atoms.ts'

type Loader = typeof HistoryLoader | typeof LibraryLoader | typeof PlatformLoader

export function useRoms() {
  const [clientRoms, setClientRoms, resetClientRoms] = useClientRoms()
  const { roms: serverRoms } = useLoaderData<Loader>()
  const roms = clientRoms || serverRoms

  function deleteRom(romId: string) {
    setClientRoms(() => roms?.filter(({ id }) => id !== romId))
  }

  return { deleteRom, resetClientRoms, roms }
}
