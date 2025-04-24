import { motion } from 'motion/react'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { GameOverlayButtons } from './game-overlay-buttons.tsx'
import { GameStates } from './game-states.tsx'

function handleAnimationComplete(animation) {
  if (animation.opacity === 1) {
    focus('.game-overlay button')
  }
}

export function GameOverlayContent() {
  const rom = useRom()
  if (!rom) {
    throw new Error('No rom found')
  }

  const goodcodes = getRomGoodcodes(rom)
  const { data: cover } = useRomCover(rom)
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className='game-overlay bg-linear-to-b pointer-events-auto absolute inset-0 z-10 flex h-dvh w-screen flex-col bg-black/70 text-white'
      exit={{ opacity: 0, scale: 1.1 }}
      initial={{ opacity: 0, scale: 1.1 }}
      onAnimationComplete={handleAnimationComplete}
      transition={{ duration: 0.2 }}
    >
      <div className='bg-linear-to-b to-text-transparent h-32 w-full from-black' />
      <div className='w-6xl mx-auto flex flex-1 flex-col gap-8'>
        <div className='flex items-center gap-4'>
          <div className='size-30 shrink-0'>
            {cover ? (
              <img alt={goodcodes.rom} className='size-30 object-contain object-center' src={cover.src} />
            ) : null}
          </div>
          <div className='text-3xl font-semibold'>{goodcodes.rom}</div>
        </div>
        <div className='flex gap-8'>
          <GameOverlayButtons />
        </div>
        <GameStates />
      </div>
      <div className='bg-linear-to-b h-32 w-full from-transparent to-black text-transparent' />
    </motion.div>
  )
}
