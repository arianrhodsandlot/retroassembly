import { Skeleton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { compact } from 'es-toolkit'
import { Fragment } from 'react/jsx-runtime'
import { Link } from 'react-router'
import { platformMap } from '@/constants/platform.ts'
import type { SearchRoms } from '@/controllers/search-roms.ts'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { skeletonClassnames } from '@/pages/library/constants/skeleton-classnames.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { getPlatformIcon, getRomGoodcodes } from '@/utils/library.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useSelectedResult } from './atoms.ts'

interface SearchResultItemProps {
  query: string
  rom: SearchRoms[number]
}

export function SearchResultItem({ query, rom }: Readonly<SearchResultItemProps>) {
  const { data: cover, isLoading } = useRomCover(rom)
  const goodcodes = getRomGoodcodes(rom)
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [selectedResult, setSelectedResult] = useSelectedResult()

  const selected = selectedResult === rom

  function handleClick() {
    setSpatialNavigationPaused(false)
    setShowSearchModal(false)
  }

  const romUrl = `/library/platform/${encodeURIComponent(rom.platform)}/rom/${encodeURIComponent(rom.fileName)}`
  const queryChars = compact([...query.toLowerCase()])

  function handleMouseEnter() {
    setSelectedResult(rom)
  }

  return (
    <li className='p-1' onMouseEnter={handleMouseEnter}>
      <Link
        className={clsx('flex items-center gap-2 rounded-sm p-1 transition-colors', {
          'bg-(--accent-4)': selected,
        })}
        onClick={handleClick}
        to={romUrl}
      >
        {isLoading ? (
          <div className='flex size-12 shrink-0 items-center justify-center'>
            <Skeleton className={skeletonClassnames[rom.platform] || '!aspect-square !size-full'} loading />
          </div>
        ) : (
          <img
            alt={goodcodes.rom}
            className='size-12 shrink-0 rounded object-contain object-center'
            src={cover?.src || ''}
          />
        )}
        <div className='flex min-w-0 flex-1 flex-col justify-center gap-1'>
          <div className='text-(--color-text) truncate text-base'>
            {[...goodcodes.rom].map((char, index) => (
              <Fragment key={index}>
                {queryChars.includes(char.toLowerCase()) ? <span className='text-(--accent-9)'>{char}</span> : char}
              </Fragment>
            ))}
          </div>
          <div className='flex items-center gap-1 text-xs'>
            <img
              alt={platformMap[rom.platform].displayName}
              className='block size-4 object-contain'
              src={getPlatformIcon(rom.platform)}
            />
            {platformMap[rom.platform].displayName}
          </div>
        </div>
      </Link>
    </li>
  )
}
