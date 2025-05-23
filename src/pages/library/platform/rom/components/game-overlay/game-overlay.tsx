import { GameOverlayContent } from './game-overlay-content.tsx'
import { GameOverlayController } from './game-overlay-controller.tsx'

export function GameOverlay() {
  return (
    <div className='pointer-events-none fixed inset-0 z-10 overflow-hidden text-white *:pointer-events-auto *:absolute *:inset-0'>
      <GameOverlayController />
      <GameOverlayContent />
    </div>
  )
}
