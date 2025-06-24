import { isMatch } from 'es-toolkit/compat'
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react'
import { useMemo } from 'react'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { useLaunchButtonRect } from '../atoms.ts'
import { useEmulator } from '../hooks/use-emulator.ts'

export function GameAnimatePresence() {
  const { emulator, launched, toggleFullscreen } = useEmulator()
  const { preference } = usePreference()
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

  async function handleAnimationComplete(definition: TargetAndTransition) {
    if (isMatch(definition, animateStyle) && emulator) {
      await emulator.start()
      const canvas = emulator.getCanvas()
      if (canvas) {
        canvas.style.opacity = '1'
      }

      if (preference.emulator.fullscreen) {
        toggleFullscreen()
      }
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
          transition={{ duration: 0.2 }}
        />
      ) : null}
    </AnimatePresence>
  )
}
