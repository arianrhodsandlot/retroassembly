'use client'
import { useKeyboardEvent, useResizeObserver } from '@react-hookz/web'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useEmulator } from '../hooks/use-emulator.ts'

const directionKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'])

export function LaunchButton() {
  const { emulator, isPreparing, launch, launched } = useEmulator()
  const [initialStyle, setInitialStyle] = useState<any>()
  const animateStyle = { height: '100%', left: 0, top: 0, width: '100%' }

  const ref = useRef<HTMLButtonElement>(null)

  function handleAnimationComplete() {
    const canvas = emulator?.getCanvas()
    if (canvas) {
      canvas.style.opacity = '1'
    }
  }

  useKeyboardEvent(true, (event) => {
    if (emulator?.getStatus() === 'initial') {
      const isEscapeKey = event.key === 'Escape'
      const isSpecialKey = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
      const isDirectionKey = directionKeys.has(event.key)
      const shoudLaunch = !isSpecialKey && !isDirectionKey && !isEscapeKey
      if (shoudLaunch) {
        launch()
      }
    }
  })

  useResizeObserver<HTMLButtonElement>(ref, (entry) => {
    const rect = entry.target.getBoundingClientRect()
    const newInitialStyle = { height: rect.height, left: rect.left, top: rect.top, width: rect.width }
    setInitialStyle(newInitialStyle)
  })

  return (
    <button
      className={clsx(
        'inline-flex h-16 w-72 items-center justify-center gap-1.5 rounded bg-[var(--theme)] text-xl font-bold text-white',
        { 'opacity-50': isPreparing },
      )}
      disabled={isPreparing}
      onClick={launch}
      ref={ref}
      type='button'
    >
      <span className={isPreparing ? 'icon-[mdi--loading] animate-spin' : 'icon-[mdi--play]'} />
      {isPreparing ? 'Loading...' : 'Press any key to start'}

      <AnimatePresence>
        {launched ? (
          <motion.div
            animate={{ ...animateStyle, opacity: 1 }}
            className='z-1 fixed bg-black'
            exit={{ ...initialStyle, opacity: 0 }}
            initial={{ ...initialStyle, opacity: 0 }}
            onAnimationComplete={handleAnimationComplete}
            transition={{ duration: 0.3 }}
          />
        ) : null}
      </AnimatePresence>
    </button>
  )
}
