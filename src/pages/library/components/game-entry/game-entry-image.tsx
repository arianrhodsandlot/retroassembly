import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { getRomGoodcodes } from '@/utils/client/library.ts'
import { skeletonClassnames } from '../../constants/skeleton-classnames.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'
import { useViewport } from '../../hooks/use-viewport.ts'

export function GameEntryImage({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const { data: cover, isLoading } = useRomCover(rom)
  const [loaded, setLoaded] = useState(false)
  const shouldShowskeleton = isLoading || !loaded
  const { isLargeScreen } = useViewport()

  function handleLoad() {
    setLoaded(true)
  }

  const image = (
    <img
      alt={goodcodes.rom}
      className='max-h-full max-w-full rounded object-contain object-bottom'
      loading='lazy'
      onError={handleLoad}
      onLoad={handleLoad}
      src={cover?.src}
    />
  )

  const atropos = (
    <Atropos
      activeOffset={0}
      className='size-full'
      highlight={false}
      innerClassName={clsx('!flex items-end justify-center transition-opacity', {
        'opacity-0': !loaded,
      })}
      shadow={false}
    >
      {image}
    </Atropos>
  )

  const coverElement = isLargeScreen ? (
    atropos
  ) : (
    <div className='flex size-full items-center justify-center'>{image}</div>
  )

  return (
    <div className='!w-9/10 relative aspect-square overflow-hidden'>
      <AnimatePresence>
        {shouldShowskeleton ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='z-11 absolute top-0 flex size-full items-end justify-center'
            exit={{ opacity: 0 }}
          >
            <Skeleton
              className={skeletonClassnames[rom.platform] || '!aspect-square !size-full'}
              loading
              style={{
                animationDelay: `-${(rom.fileName.length % 10) / 4}s !important`,
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {cover?.src ? coverElement : null}
    </div>
  )
}
