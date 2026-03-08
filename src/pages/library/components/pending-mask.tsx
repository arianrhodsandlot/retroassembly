import { AnimatePresence, motion } from 'motion/react'
import { RadixThemePortal } from '#@/pages/components/radix-theme-portal.tsx'
import { useRouter } from '../hooks/use-router.ts'

export function PendingMask() {
  const { isNavigating } = useRouter()

  return (
    <RadixThemePortal>
      <AnimatePresence>
        {isNavigating ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed right-6 bottom-14 z-10 flex items-center justify-center'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className='rounded-full bg-(--color-background) p-2 ring-1 ring-(--gray-4)'>
              <span className='icon-[svg-spinners--180-ring] block text-(--accent-9)' />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </RadixThemePortal>
  )
}
