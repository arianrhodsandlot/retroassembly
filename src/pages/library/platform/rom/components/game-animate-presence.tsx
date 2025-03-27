'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'
import { useLaunchButtonRect } from '../atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'

export function GameAnimatePresence() {
  const { emulator, launched } = useEmulator()
  const animateStyle = { height: '100%', left: 0, top: 0, width: '100%' }
  const [launchButtonRect] = useLaunchButtonRect()
  const initialStyle = useMemo(
    () =>
      launchButtonRect
        ? {
            height: launchButtonRect.height,
            left: launchButtonRect.left,
            top: launchButtonRect.top,
            width: launchButtonRect.width,
          }
        : {},
    [launchButtonRect],
  )

  function handleAnimationComplete() {
    const canvas = emulator?.getCanvas()
    if (canvas) {
      canvas.style.opacity = '1'
    }
  }

  return (
    <AnimatePresence>
      {launched ? (
        <motion.div
          animate={{ ...animateStyle, backgroundColor: 'oklch(0 0 0)', opacity: 1 }}
          className='z-1 fixed bg-black'
          exit={{ ...initialStyle, backgroundColor: 'oklch(0.514 0.222 16.935)', opacity: 0.5 }}
          initial={{ ...initialStyle, backgroundColor: 'oklch(0.514 0.222 16.935)', opacity: 1 }}
          onAnimationComplete={handleAnimationComplete}
          transition={{ duration: 0.3 }}
        />
      ) : null}
    </AnimatePresence>
  )
}
