import { Skeleton } from '@radix-ui/themes'
import Atropos from 'atropos/react'
import { AnimatePresence, motion } from 'motion/react'
import { getRomGoodcodes } from '@/utils/library.ts'
import { skeletonClassnames } from '../../constants/skeleton-classnames.ts'
import { useRomCover } from '../../hooks/use-rom-cover.ts'

export function GameEntryImage({ rom }) {
  const goodcodes = getRomGoodcodes(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <div className='!w-9/10 relative flex aspect-square items-center justify-center overflow-hidden'>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='absolute inset-0 flex items-end justify-center'
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
          >
            <Skeleton className={skeletonClassnames[rom.platform] || '!size-full'} loading />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {cover?.src ? (
        <Atropos activeOffset={0} className='!size-full' shadow={false}>
          <img
            alt={goodcodes.rom}
            className='size-full rounded object-contain object-bottom'
            loading='lazy'
            src={cover.src}
          />
        </Atropos>
      ) : null}
    </div>
  )
}
