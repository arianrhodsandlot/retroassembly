import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlayButtons() {
  const { emulator, exit } = useEmulator()
  const { saveState } = useGameStates()
  const { hide, setIsPending } = useGameOverlay()
  const isDemo = useIsDemo()

  function handleClickResume() {
    hide()
  }

  function handleClickRestart() {
    hide()
    emulator?.restart()
  }

  async function handleClickSaveState() {
    setIsPending(true)
    try {
      await saveState()
      focus('.game-overlay button')
    } finally {
      setIsPending(false)
    }
  }

  function handleClickExit() {
    hide()
    exit()
  }

  async function handleClickSaveExit() {
    setIsPending(true)
    try {
      await saveState()
      hide()
      exit()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <GameOverlayButton dataSnLeft='.game-overlay-buttons button:last-child' onClick={handleClickResume}>
        <span className='icon-[mdi--play] size-5' />
        Resume
      </GameOverlayButton>

      <GameOverlayButton disabled={isDemo} onClick={handleClickSaveState}>
        <span className='icon-[mdi--content-save] size-5' />
        Save State
      </GameOverlayButton>

      <div className='hidden lg:block lg:flex-1' />

      <GameOverlayButton onClick={handleClickRestart}>
        <span className='icon-[mdi--restart] size-5' />
        Restart
      </GameOverlayButton>

      <GameOverlayButton onClick={handleClickExit}>
        <span className='icon-[mdi--exit-to-app] size-5' />
        Exit
      </GameOverlayButton>

      <GameOverlayButton
        dataSnRight='.game-overlay-buttons button:first-child'
        disabled={isDemo}
        onClick={handleClickSaveExit}
      >
        <span className='icon-[mdi--location-exit] size-5' />
        Save & Exit
      </GameOverlayButton>
    </>
  )
}
