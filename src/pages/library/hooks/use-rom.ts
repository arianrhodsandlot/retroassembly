import { useLoaderData } from 'react-router'
import type { loader } from '#@/pages/routes/library-platform-rom.tsx'

export function useRom() {
  const { rom } = useLoaderData<typeof loader>()
  return rom
}
