'use client'
import { useState } from 'react'
import { PreferenceContext } from './preference-context.ts'

export function PreferenceContextProvider({ children, initial }) {
  const state = useState(initial)
  return <PreferenceContext value={state}>{children}</PreferenceContext>
}
