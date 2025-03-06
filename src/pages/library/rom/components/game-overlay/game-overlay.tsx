'use client'
import { createPortal } from 'react-dom'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { GameOverlayButtons } from './game-overlay-buttons.tsx'
import { GameStates } from './game-states.tsx'

export function GameOverlay() {
  const { show } = useGameOverlay()

  if (show) {
    return createPortal(
      <div className='bg-linear-to-b absolute inset-0 z-10 flex h-screen w-screen flex-col bg-black/50'>
        <div className='bg-linear-to-b to-text-transparent h-32 w-full from-black' />
        <div className='w-6xl mx-auto flex flex-1 flex-col gap-8'>
          <div className='flex gap-8 text-white'>
            <GameOverlayButtons />
          </div>
          <h3 className='flex items-center gap-2 text-2xl font-semibold text-white'>
            <span className='icon-[mdi--database] size-7' />
            States
          </h3>
          <GameStates />
        </div>
        <div className='bg-linear-to-b h-32 w-full from-transparent to-black text-transparent' />
      </div>,
      document.body,
    )
  }
}
