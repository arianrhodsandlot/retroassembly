'use client'
import { ServerDataContext } from './server-data-context.ts'

export function ServerDataContextProvider({ children, value }) {
  return <ServerDataContext value={value}>{children}</ServerDataContext>
}
