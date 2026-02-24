import { type ChangeEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsDemo } from '#@/pages/library/hooks/use-demo.ts'
import { focus } from '#@/pages/library/utils/spatial-navigation.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { useGameStates } from '../hooks/use-game-states.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlayButtons() {
  const { t } = useTranslation()
  const { emulator, exit } = useEmulator()
  const { importSave, isImportingSave, saveManualState } = useGameStates()
  const { hide, setIsPending } = useGameOverlay()
  const isDemo = useIsDemo()
  // ref for the hidden file input used to import an existing save file
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleClickResume() {
    await hide()
  }

  async function handleClickRestart() {
    await hide()
    emulator?.restart()
  }

  async function handleClickSaveState() {
    setIsPending(true)
    try {
      await saveManualState()
      focus('.game-overlay button')
    } finally {
      setIsPending(false)
    }
  }

  async function handleClickExit() {
    await hide()
    await exit({ reloadAfterExit: true })
  }

  async function handleClickSaveExit() {
    setIsPending(true)
    try {
      await saveManualState()
      await hide()
      await exit({ reloadAfterExit: true })
    } finally {
      setIsPending(false)
    }
  }

  async function handleImportFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith('.state')) {
      return
    }
    setIsPending(true)
    try {
      await importSave(file)
      focus('.game-overlay button')
    } finally {
      setIsPending(false)
      // reset so the same file can be re-imported if needed
      e.target.value = ''
    }
  }

  return (
    <>
      <GameOverlayButton dataSnLeft='.game-overlay-buttons button:last-child' onClick={handleClickResume}>
        <span className='icon-[mdi--play] size-5' />
        {t('Resume')}
      </GameOverlayButton>

      <GameOverlayButton disabled={isDemo} onClick={handleClickSaveState}>
        <span className='icon-[mdi--content-save] size-5' />
        {t('Save State')}
      </GameOverlayButton>

      {/* hidden input; clicking the button below triggers it */}
      <input
        accept='.state'
        aria-hidden='true'
        className='sr-only'
        onChange={handleImportFileChange}
        ref={fileInputRef}
        tabIndex={-1}
        type='file'
      />
      <GameOverlayButton disabled={isDemo || isImportingSave} onClick={() => fileInputRef.current?.click()}>
        <span className='icon-[mdi--upload] size-5' />
        {t('Import Save')}
      </GameOverlayButton>

      <div className='hidden lg:block lg:flex-1' />

      <GameOverlayButton onClick={handleClickRestart}>
        <span className='icon-[mdi--restart] size-5' />
        {t('Restart')}
      </GameOverlayButton>

      <GameOverlayButton onClick={handleClickExit}>
        <span className='icon-[mdi--exit-to-app] size-5' />
        {t('Exit')}
      </GameOverlayButton>

      <GameOverlayButton
        dataSnRight='.game-overlay-buttons button:first-child'
        disabled={isDemo}
        onClick={handleClickSaveExit}
      >
        <span className='icon-[mdi--location-exit] size-5' />
        {t('Save & Exit')}
      </GameOverlayButton>
    </>
  )
}
