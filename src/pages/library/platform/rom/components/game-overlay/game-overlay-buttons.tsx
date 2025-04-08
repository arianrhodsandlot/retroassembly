import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlayButtons() {
  const { emulator, exit } = useEmulator()
  const { saveState } = useGameStates()
  const { isPending, setIsPending, toggle } = useGameOverlay()

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
    try {
      await saveState()
    } finally {
      setIsPending(false)
    }
  }

  function handleClickExit() {
    exit()
    toggle()
  }

  async function handleClickSaveExit() {
    setIsPending(true)
    try {
      await saveState()
      toggle()
      exit()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <GameOverlayButton isLoading={isPending} onClick={handleClickResume}>
        <span className='icon-[material-symbols--resume] size-5' />
        Resume
      </GameOverlayButton>

      <GameOverlayButton isLoading={isPending} onClick={handleClickSaveState}>
        <span className='icon-[mdi--content-save] size-5' />
        Save State
      </GameOverlayButton>

      <div className='flex-1' />
      <GameOverlayButton isLoading={isPending} onClick={handleClickRestart}>
        <span className='icon-[mdi--restart] size-5' />
        Restart
      </GameOverlayButton>

      <GameOverlayButton isLoading={isPending} onClick={handleClickExit}>
        <span className='icon-[mdi--exit-to-app] size-5' />
        Exit
      </GameOverlayButton>

      <GameOverlayButton isLoading={isPending} onClick={handleClickSaveExit}>
        <span className='icon-[mdi--location-exit] size-5' />
        Save & Exit
      </GameOverlayButton>
    </>
  )
}
