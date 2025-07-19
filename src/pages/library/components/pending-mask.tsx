import { AnimatePresence, motion } from 'motion/react'
import { useNavigation } from 'react-router'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'

export function PendingMask() {
  const { state } = useNavigation()
  const isNavigating = state === 'loading'

  return (
    <RadixThemePortal>
      <AnimatePresence>
        {isNavigating ? (
          <motion.div
            animate={{ backdropFilter: 'blur(2px)', opacity: 1 }}
            className='bg-(--color-background)/20 absolute inset-0 z-10 flex items-center justify-center'
            exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
            initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className='bg-(--color-background) ring-(--gray-4) rounded-full p-2 ring-1'>
              <span className='icon-[svg-spinners--180-ring] text-(--accent-9) block size-12' />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RadixThemePortal>
  )
}
