import { Tooltip } from '@radix-ui/themes'
import { noop } from 'es-toolkit'
import { useEffect, useSyncExternalStore } from 'react'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useShowSearchModal } from '../atoms.ts'

const appleKeywords = ['mac', 'iphone', 'ipad']

function subscribe() {
  return noop
}

function getSnapshot() {
  const ua = navigator.userAgent.toLowerCase()
  return appleKeywords.some((keyword) => ua.includes(keyword))
}

function getServerSnapshot() {
  return false
}

export function SearchButton() {
  const [showSearchModal, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  const isDemo = useIsDemo()

  const isApple = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const tooltip = isApple ? 'Search (⌘ + K)' : 'Search (Ctrl + K)'

  function showSearch() {
    setSpatialNavigationPaused(true)
    setShowSearchModal(true)
  }

  useEffect(() => {
    const abortController = new AbortController()

    function hideSearch() {
      setSpatialNavigationPaused(false)
      setShowSearchModal(false)
    }

    function toggleSearch() {
      setSpatialNavigationPaused((paused) => !paused)
      setShowSearchModal((show) => !show)
    }

    document.body.addEventListener(
      'keydown',
      (event) => {
        if (showSearchModal && event.key === 'Escape') {
          event.preventDefault()
          hideSearch()
        }
        const modifierKey = isApple ? event.metaKey : event.ctrlKey
        if (modifierKey && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          toggleSearch()
        }
      },
      { signal: abortController.signal },
    )

    return () => {
      abortController.abort()
    }
  }, [isApple, setShowSearchModal, setSpatialNavigationPaused, showSearchModal])

  if (isDemo) {
    return
  }

  return (
    <Tooltip content={tooltip}>
      <button
        aria-label='Search'
        className='leading-0 absolute right-1 rounded p-2 opacity-90 hover:bg-black/10 hover:opacity-100'
        onClick={showSearch}
        type='button'
      >
        <span className='icon-[mdi--search] size-5 p-0.5' />
      </button>
    </Tooltip>
  )
}
