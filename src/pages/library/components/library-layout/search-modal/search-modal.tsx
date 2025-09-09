import { delay } from 'es-toolkit'
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react'
import { useCallback, useEffect } from 'react'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useIsApple } from '@/pages/library/hooks/use-is-apple.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useSelectedResult } from './atoms.ts'
import { SearchBar } from './search-bar.tsx'

async function handleAnimationComplete({ opacity }: TargetAndTransition) {
  if (opacity) {
    const input = document.querySelector<HTMLInputElement>('input[name="query"]')
    if (input) {
      input.select()
      await delay(100)
      focus(input)
    }
  }
}

export function SearchModal() {
  const [showSearchModal, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [, setSelectedResult] = useSelectedResult()
  const isApple = useIsApple()

  const close = useCallback(() => {
    setSpatialNavigationPaused(false)
    setShowSearchModal(false)
  }, [setSpatialNavigationPaused, setShowSearchModal])

  const toggle = useCallback(() => {
    if (!showSearchModal) {
      setSelectedResult(null)
    }
    setSpatialNavigationPaused((paused) => !paused)
    setShowSearchModal(!showSearchModal)
  }, [showSearchModal, setSelectedResult, setSpatialNavigationPaused, setShowSearchModal])

  useEffect(() => {
    const abortController = new AbortController()

    document.body.addEventListener(
      'keydown',
      (event) => {
        if (showSearchModal && event.key === 'Escape') {
          event.preventDefault()
          close()
        }
        const modifierKey = isApple ? event.metaKey : event.ctrlKey
        if (modifierKey && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          toggle()
        }
      },
      { signal: abortController.signal },
    )

    return () => {
      abortController.abort()
    }
  }, [isApple, showSearchModal, close, toggle])

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
            onClick={close}
          />
        ) : null}
      </AnimatePresence>

      <div className='z-1 pointer-events-none absolute inset-0 *:pointer-events-auto'>
        <AnimatePresence>
          {showSearchModal ? (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              onAnimationComplete={handleAnimationComplete}
              role='dialog'
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
