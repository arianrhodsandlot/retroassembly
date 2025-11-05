import { Badge, Skeleton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { compact } from 'es-toolkit'
import { useEffect, useRef } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import { platformMap } from '@/constants/platform.ts'
import type { SearchRoms } from '@/controllers/roms/search-roms.ts'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { skeletonClassnames } from '@/pages/library/constants/skeleton-classnames.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { getPlatformIcon, getRomGoodcodes } from '@/utils/client/library.ts'
import { DistrictIcon } from '../../district-icon.tsx'
import { useShowSearchModal } from '../atoms.ts'
import { useSelectedResult } from './atoms.ts'

interface SearchResultItemProps {
  keyword: string
  rom: SearchRoms[number]
}

export function SearchResultItem({ keyword, rom }: Readonly<SearchResultItemProps>) {
  const { t } = useTranslation()
  const { preference } = usePreference()
  const { data: cover, isLoading } = useRomCover(rom)
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [selectedResult, setSelectedResult] = useSelectedResult()

  const goodcodes = getRomGoodcodes(rom)

  const { countries, revision, version = {} } = goodcodes.codes
  const districts = new Set(countries?.map(({ code }) => code))
  const revisionText = revision ? `Rev ${revision}` : ''
  const versionText = Object.keys(version)
    .filter((text) => text !== 'stable')
    .join(' ')

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
        title={rom.fileName}
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
            {preference.ui.showDistrictOnTitle
              ? [...districts].map((district) => <DistrictIcon district={district} key={district} />)
              : null}

            {[...goodcodes.rom].map((char, index) => (
              <Fragment key={index}>
                {keywordChars.includes(char.toLowerCase()) ? <span className='text-(--accent-9)'>{char}</span> : char}
              </Fragment>
            ))}

            {compact([revisionText, versionText]).map((text) => (
              <Badge className='mx-0.5 capitalize' key={text} size='1'>
                {text}
              </Badge>
            ))}
          </div>
          <div className='flex items-center gap-1 text-xs'>
            <img
              alt={t(platformMap[rom.platform].displayName)}
              className='block size-4 object-contain'
              src={getPlatformIcon(rom.platform)}
            />
            {t(platformMap[rom.platform].displayName)}
          </div>
        </div>
      </Link>
    </li>
  )
}
