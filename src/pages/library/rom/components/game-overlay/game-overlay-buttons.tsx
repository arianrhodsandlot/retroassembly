'use client'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlayButtons() {
  const { emulator, exit } = useEmulator()
  const { isSavingState, saveState } = useGameStates()
  const { setIsPending, toggle } = useGameOverlay()

  function handleClickResume() {
    emulator?.resume()
    toggle()
  }

  function handleClickRestart() {
    emulator?.restart()
    toggle()
  }

  async function handleClickSaveState() {
    setIsPending(true)
    await saveState()
    setIsPending(false)
  }

  function handleClickExit() {
    exit()
    toggle()
  }

  return (
    <>
      <GameOverlayButton onClick={handleClickResume}>
        <span className='icon-[material-symbols--resume] size-7' />
        Resume
      </GameOverlayButton>

      <GameOverlayButton isLoading={isSavingState} onClick={handleClickSaveState}>
        <span className='icon-[mdi--content-save] size-7' />
        Save State
      </GameOverlayButton>

      <div className='flex-1' />
      <GameOverlayButton onClick={handleClickRestart}>
        <span className='icon-[mdi--restart] size-7' />
        Restart
      </GameOverlayButton>

      <GameOverlayButton onClick={handleClickExit}>
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
