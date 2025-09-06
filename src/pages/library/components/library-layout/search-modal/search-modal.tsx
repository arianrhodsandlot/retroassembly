import { AnimatePresence, motion } from 'motion/react'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useShowSearchModal } from '../atoms.ts'
import { SearchBar } from './search-bar.tsx'

export function SearchModal() {
  const [showSearchModal, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  function handleClickClose() {
    setSpatialNavigationPaused(false)
    setShowSearchModal(false)
  }

  return (
    <>
      <AnimatePresence>
        {showSearchModal ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden
            className='bg-(--color-overlay) z-1 absolute inset-0 !cursor-default'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={handleClickClose}
          />
        ) : null}
      </AnimatePresence>

      <div className='z-1 pointer-events-none absolute inset-0'>
        <AnimatePresence>
          {showSearchModal ? (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              transition={{ bounce: 0, duration: 0.1 }}
            >
              <SearchBar />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}
