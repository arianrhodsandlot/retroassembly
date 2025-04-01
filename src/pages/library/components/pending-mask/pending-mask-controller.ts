'use client'
import { useEffect } from 'react'
import { useShowPendingMaskAtom } from '../../atoms.ts'

export function PendingMaskController() {
  const [, setShowPendingMaskAtom] = useShowPendingMaskAtom()

  useEffect(() => {
    setShowPendingMaskAtom(true)
    return () => {
      setShowPendingMaskAtom(false)
    }
  })

  return null
}
