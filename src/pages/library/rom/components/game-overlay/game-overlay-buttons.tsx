'use client'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlayButtons() {

  const { exit, restart, resume } = useEmulator()
  const { saveState } = useGameStates()

  return (
    <>
      <GameOverlayButton onClick={resume}>
        <span className='icon-[material-symbols--resume] size-7' />
        Resume
      </GameOverlayButton>

      <GameOverlayButton onClick={saveState}>
        <span className='icon-[mdi--content-save] size-7' />
        Save State
      </GameOverlayButton>
      <div className='flex-1' />
      <GameOverlayButton onClick={restart}>
        <span className='icon-[mdi--restart] size-7' />
        Restart
      </GameOverlayButton>
      <GameOverlayButton onClick={exit}>
        <span className='icon-[mdi--exit-to-app] size-7' />
        Exit
      </GameOverlayButton>
      <GameOverlayButton>
        <span className='icon-[mdi--location-exit] size-7' />
        Save & Exit
      </GameOverlayButton>
    </>
  )
}
