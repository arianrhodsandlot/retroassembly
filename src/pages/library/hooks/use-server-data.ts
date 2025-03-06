import { use } from 'react'
import { ServerDataContext } from '../components/server-data-context.ts'

export function useServerData() {
  const serverData = use(ServerDataContext)
  return serverData
}
