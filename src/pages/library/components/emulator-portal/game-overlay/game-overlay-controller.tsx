import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useEmulatorLaunched } from '#@/pages/library/atoms.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { useMouseIdle } from '../hooks/use-mouse-idle.ts'
import { ControllerButton } from './controller-button.tsx'
import { GameInputMessage } from './game-input-message.tsx'

export function GameOverlayController() {
  const { t } = useTranslation()
  const rom = useRom()
  if (!rom) {
    throw new Error('No rom found')
  }
  const idle = useMouseIdle(3000)
  const { hide, show, visible } = useGameOverlay()
  const { exit, isFullscreen, toggleFullscreen } = useEmulator()
  const [launched] = useEmulatorLaunched()

  async function handleClickExit() {
    await Promise.all([hide(), exit({ reloadAfterExit: true })])
  }

  async function handleClickPause() {
    await show()
  }

  const controllerVisible = launched && !idle && !visible

  return (
    <AnimatePresence>
      {controllerVisible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='hidden flex-col justify-between lg:flex'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role='toolbar'
          transition={{ duration: 0.2 }}
        >
          <div>
            <div className='bg-linear-to-b flex h-20 w-full items-center justify-end from-black/70 to-black/40 px-4'>
              <ControllerButton onClick={handleClickExit} title={t('Exit')}>
                <span className='icon-[mdi--close]' />
              </ControllerButton>
            </div>
            <div className='bg-linear-to-b h-20 from-black/40 to-transparent' />
          </div>

          <div>
            <div className='bg-linear-to-b h-20 from-transparent to-black/40' />
            <div className='bg-linear-to-b flex h-20 w-full items-center from-black/40 to-black/70 px-4'>
              <ControllerButton onClick={handleClickPause} title={t('Pause')}>
                <span className='icon-[mdi--pause]' />
              </ControllerButton>
              <div className='hidden flex-1 items-center justify-center gap-4 lg:flex'>
                <GameInputMessage />
              </div>
              {isFullscreen ? (
                <ControllerButton onClick={toggleFullscreen} title={t('Exit fullscreen')}>
                  <span className='icon-[mdi--fullscreen-exit]' />
                </ControllerButton>
              ) : (
                <ControllerButton onClick={toggleFullscreen} title={t('Fullscreen')}>
                  <span className='icon-[mdi--fullscreen]' />
                </ControllerButton>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
