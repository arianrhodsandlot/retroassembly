import { Skeleton } from '@radix-ui/themes'
import { skeletonClassnames } from '@/pages/library/constants/skeleton-classnames.ts'
import { useRomCover } from '../../../hooks/use-rom-cover.ts'

export function GameCover({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return (
      <div className='top-4 block w-full lg:sticky lg:w-64'>
        <Skeleton className={skeletonClassnames[rom.platform] || '!size-full'} loading />
      </div>
    )
  }

  return cover ? (
    <a className='top-4 block w-full lg:sticky lg:w-64' href={cover.src} rel='noreferrer noopener' target='_blank'>
      <img alt={rom.name} className='block h-auto w-full' src={cover.src} />
    </a>
  ) : null
}
