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
          <motion.button
            animate={{ backdropFilter: 'blur(2px)', opacity: 1 }}
            aria-label='Close'
            className='bg-(--color-background)/20 z-1 absolute inset-0 !cursor-default'
            exit={{ backdropFilter: 'blur(0)', opacity: 0 }}
            initial={{ backdropFilter: 'blur(0)', opacity: 0 }}
            onClick={handleClickClose}
            type='button'
          />
        ) : null}
      </AnimatePresence>

      <div className='z-1 pointer-events-none absolute inset-0'>
        <AnimatePresence>
          {showSearchModal ? (
            <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} initial={{ opacity: 0, y: -20 }}>
              <SearchBar />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  )
}
