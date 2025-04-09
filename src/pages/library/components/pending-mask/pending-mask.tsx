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
              animate={{ backdropFilter: 'blur(1px)', opacity: 1 }}
              className='absolute inset-0 z-10 flex items-center justify-center bg-white/40'
              exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
              initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='rounded-full bg-white p-3 shadow-[0_0_12px] shadow-black/20'>
                <span className='icon-[svg-spinners--180-ring] block size-12 text-[var(--accent-9)]' />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Theme>
    </Portal>
  )
}
