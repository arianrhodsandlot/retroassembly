import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import type { ReactNode } from 'react'
import { skeletonClassnames } from '#@/pages/library/constants/skeleton-classnames.ts'
import { useRomCover } from '../../../hooks/use-rom-cover.ts'

export function GameCover({ className = '', parallax = false, rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  let content: ReactNode
  if (isLoading) {
    content = <Skeleton className={skeletonClassnames[rom.platform] || '!aspect-square !size-full'} loading />
  } else if (cover) {
    const img = <img alt={rom.name} className='block h-auto w-full' loading='lazy' src={cover.src} />
    content = parallax ? (
      <Atropos activeOffset={0} className='!size-full' highlight={false} shadow={false}>
        {img}
      </Atropos>
    ) : (
      img
    )
  }

  return (
    <a className={className} href={cover?.src} rel='noreferrer noopener' target='_blank' title={rom.name}>
      {content}
    </a>
  )
}
