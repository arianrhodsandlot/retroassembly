import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import { skeletonClassnames } from '@/pages/library/constants/skeleton-classnames.ts'
import { useRomCover } from '../../../hooks/use-rom-cover.ts'

export function GameCover({ className = '', rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className={skeletonClassnames[rom.platform] || '!size-full'} loading />
      </div>
    )
  }

  return cover ? (
    <a className={className} href={cover.src} rel='noreferrer noopener' target='_blank'>
      <Atropos activeOffset={0} className='!size-full' highlight={false} shadow={false}>
        <img alt={rom.name} className='block h-auto w-full' src={cover.src} />
      </Atropos>
    </a>
  ) : null
}
