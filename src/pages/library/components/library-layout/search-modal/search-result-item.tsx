import { Skeleton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { compact } from 'es-toolkit'
import { useEffect, useRef } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { Link } from 'react-router'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { platformMap } from '@/constants/platform.ts'
import type { SearchRoms } from '@/controllers/search-roms.ts'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { skeletonClassnames } from '@/pages/library/constants/skeleton-classnames.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { getPlatformIcon, getRomGoodcodes } from '@/utils/library.ts'
import { useShowSearchModal } from '../atoms.ts'
import { useSelectedResult } from './atoms.ts'

interface SearchResultItemProps {
  keyword: string
  rom: SearchRoms[number]
}

export function SearchResultItem({ keyword, rom }: Readonly<SearchResultItemProps>) {
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
  const keywordChars = compact([...keyword.replace(/\s+/, '').toLowerCase()])

  function handleMouseMove() {
    if (!selected) {
      setSelectedResult(rom)
    }
  }

  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (selected && ref.current) {
      scrollIntoView(ref.current, { scrollMode: 'if-needed' })
    }
  }, [selected])

  return (
    <li className='p-1' onMouseMove={handleMouseMove} ref={ref}>
      <Link
        className={clsx('flex items-center gap-2 rounded-sm p-1', {
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
                {keywordChars.includes(char.toLowerCase()) ? <span className='text-(--accent-9)'>{char}</span> : char}
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
