'use client'
import { Portal, Theme } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
import { useShowPendingMaskAtom } from '../../atoms.ts'

export function PendingMask() {
  const [showPendingMask] = useShowPendingMaskAtom()

  return (
    <Portal>
      <Theme accentColor='red'>
        <AnimatePresence>
          {showPendingMask ? (
            <motion.div
              animate={{ backdropFilter: 'blur(2px)', opacity: 1 }}
              className='absolute inset-0 z-10 flex items-center justify-center bg-white/40'
              exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
              initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className='icon-[svg-spinners--180-ring] text-6xl text-[var(--accent-9)]' />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Theme>
    </Portal>
  )
}
