import { AnimatePresence, motion } from 'motion/react'
import { useNavigation } from 'react-router'
import { RadixThemePortal } from '#@/pages/components/radix-theme-portal.tsx'
import { useRouter } from '../hooks/use-router.ts'

export function PendingMask() {
  const { state } = useNavigation()
  const { isReloading } = useRouter()
  const isNavigating = state === 'loading'

  if (isReloading) {
    return
  }

  return (
    <RadixThemePortal>
      <AnimatePresence>
        {isNavigating ? (
          <motion.div
            animate={{ backdropFilter: 'blur(0)', opacity: 1 }}
            className='fixed inset-0 z-10 flex items-center justify-center bg-(--color-overlay)'
            exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
            initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className='rounded-full bg-(--color-background) p-2 ring-1 ring-(--gray-4)'>
              <span className='icon-[svg-spinners--180-ring] block size-12 text-(--accent-9)' />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RadixThemePortal>
  )
}
