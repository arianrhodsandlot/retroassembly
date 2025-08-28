import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import type { ReactNode } from 'react'
import { getRomGoodcodes } from '@/utils/library.ts'
import { skeletonClassnames } from '../../constants/skeleton-classnames.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'

export function GameEntryImage({ rom }) {
  const goodcodes = getRomGoodcodes(rom || {})
  const { data: cover, isLoading } = useRomCover(rom)

  let content: ReactNode
  if (isLoading) {
    content = (
      <div className='flex size-full items-end justify-center'>
        <Skeleton className={skeletonClassnames[rom.platform] || '!aspect-square !size-full'} loading />
      </div>
    )
  } else if (cover?.src) {
    content = (
      <Atropos
        activeOffset={0}
        className='size-full'
        highlight={false}
        innerClassName='!flex items-end justify-center'
        shadow={false}
      >
        <img
          alt={goodcodes.rom}
          className='max-h-full max-w-full rounded object-contain object-bottom'
          loading='lazy'
          src={cover.src}
        />
      </Atropos>
    )
  }

  return <div className='!w-9/10 aspect-square overflow-hidden'>{content}</div>
}
