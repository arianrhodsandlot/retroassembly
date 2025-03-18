'use client'
import { useState } from 'react'
import { ServerDataContext } from './server-data-context.ts'

export function ServerDataContextProvider({ children, initial }) {
  const state = useState(initial)
  return <ServerDataContext value={state}>{children}</ServerDataContext>
}
