import { Portal, Theme } from '@radix-ui/themes'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigation } from 'react-router'

export function PendingMask() {
  const navigation = useNavigation()

  return (
    <Portal>
      <Theme accentColor='red'>
        <AnimatePresence>
          {navigation.state === 'loading' ? (
            <motion.div
              animate={{ backdropFilter: 'blur(4px)', opacity: 1 }}
              className='absolute inset-0 z-10 flex items-center justify-center bg-white/20'
              exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
              initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className='rounded-full bg-white p-2 ring-1 ring-neutral-300'>
                <span className='icon-[svg-spinners--180-ring] text-(--accent-9) block size-12' />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Theme>
    </Portal>
  )
}
