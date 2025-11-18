import { Tooltip } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { useSpatialNavigationPaused } from '#@/pages/library/atoms.ts'
import { useIsDemo } from '#@/pages/library/hooks/use-demo.ts'
import { useIsApple } from '#@/pages/library/hooks/use-is-apple.ts'
import { useShowSearchModal } from '../atoms.ts'

export function SearchButton() {
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const { t } = useTranslation()

  const isDemo = useIsDemo()
  const isApple = useIsApple()

  function showSearch() {
    setSpatialNavigationPaused(true)
    setShowSearchModal(true)
  }

  if (isDemo) {
    return
  }

  return (
    <Tooltip content={isApple ? t('Search (⌘ + K)') : t('Search (Ctrl + K)')}>
      <button
        aria-label={t('Search')}
        className='leading-0 absolute right-1 rounded p-2 opacity-90 hover:bg-black/10 hover:opacity-100'
        onClick={showSearch}
        type='button'
      >
        <span className='icon-[mdi--search] size-5 p-0.5' />
      </button>
    </Tooltip>
  )
}
