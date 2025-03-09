'use client'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, type UIEventHandler, useState } from 'react'
import AppLayout from '../../../components/app-layout.tsx'
import { useEmulator } from '../hooks/use-emulator.ts'

interface RomAppLayoutProps {
  append?: ReactNode
  children: ReactNode
  onMainScroll?: UIEventHandler<HTMLDivElement>
  serverData?: Record<string, unknown>
  sidebar?: ReactNode
}

export function RomAppLayout({ append, children, serverData, sidebar }: RomAppLayoutProps) {
  const { emulator, launched } = useEmulator()
  const [initialStyle, setInitialStyle] = useState<any>()
  const animateStyle = { height: '100%', left: 0, top: 0, width: '100%' }

  function handlerMainScroll(event) {
    const button = event.target.querySelector('button')
    const rect = button.getBoundingClientRect()
    const newInitialStyle = { height: rect.height, left: rect.left, top: rect.top, width: rect.width }
    setInitialStyle(newInitialStyle)
  }

  function handleAnimationComplete() {
    const canvas = emulator?.getCanvas()
    if (canvas) {
      canvas.style.opacity = '1'
    }
  }

  return (
    <AppLayout append={append} onMainScroll={handlerMainScroll} serverData={serverData} sidebar={sidebar}>
      {children}

      <AnimatePresence>
        {launched ? (
          <motion.div
            animate={{ ...animateStyle, opacity: 1 }}
            className='z-1 fixed bg-rose-950'
            exit={{ ...initialStyle, opacity: 0 }}
            initial={{ ...initialStyle, opacity: 0 }}
            onAnimationComplete={handleAnimationComplete}
            transition={{ duration: 5 }}
          />
        ) : null}
      </AnimatePresence>
    </AppLayout>
  )
}
