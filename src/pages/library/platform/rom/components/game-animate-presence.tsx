'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useState } from 'react'
import { useEmulator } from '../hooks/use-emulator.ts'

export function GameAnimatePresence() {
  const { emulator, launched } = useEmulator()
  const [initialStyle, setInitialStyle] = useState<any>()
  const animateStyle = { height: '100%', left: 0, top: 0, width: '100%' }

  function syncInitialStyle() {
    const button = document.body?.querySelector<HTMLButtonElement>('.launch-button')
    if (button) {
      const rect = button.getBoundingClientRect()
      const newInitialStyle = { height: rect.height, left: rect.left, top: rect.top, width: rect.width }
      setInitialStyle(newInitialStyle)
    }
  }

  function handleAnimationComplete() {
    const canvas = emulator?.getCanvas()
    if (canvas) {
      canvas.style.opacity = '1'
    }
  }

  useLayoutEffect(syncInitialStyle, [])

  return (
    <AnimatePresence>
      {launched ? (
        <motion.div
          animate={{ ...animateStyle, backgroundColor: 'oklch(0 0 0)', opacity: 1 }}
          className='z-1 fixed bg-black'
          exit={{ ...initialStyle, backgroundColor: 'oklch(0.514 0.222 16.935)', opacity: 1 }}
          initial={{ ...initialStyle, backgroundColor: 'oklch(0.514 0.222 16.935)', opacity: 1 }}
          onAnimationComplete={handleAnimationComplete}
          transition={{ duration: 0.3 }}
        />
      ) : null}
    </AnimatePresence>
  )
}
