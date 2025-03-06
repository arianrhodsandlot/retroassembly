import { useServerData } from '../../hooks/use-server-data.ts'

export function useRom() {
  const { rom } = useServerData()
  return rom
}
