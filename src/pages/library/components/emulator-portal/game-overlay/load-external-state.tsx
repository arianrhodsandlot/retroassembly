import { Button } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import { delay, range } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { useGameStates } from '../hooks/use-game-states.ts'

export function LoadExternalState() {
  const { t } = useTranslation()
  const { saveManualState } = useGameStates()
  const { hide } = useGameOverlay()
  const { emulator } = useEmulator()

  async function saveState(state: File) {
    if (!emulator) {
      return
    }
    const confirmed = confirm(t('dialog.saveExternalStateQuestion'))
    if (!confirmed) {
      return
    }
    try {
      await saveManualState({ state })
    } catch {
      alert(t('error.failedToImportState'))
    }
  }

  const { isMutating: isImporting, trigger: handleClickLoadExternal } = useSWRMutation('importState', async () => {
    const state = await fileOpen({ extensions: ['.state', ...range(1, 10).map((i) => `.state${i}`)] })
    await emulator?.loadState(state)
    await hide()
    await delay(500)
    emulator?.pause()
    await saveState(state)
    emulator?.resume()
  })

  return (
    <Button
      variant='ghost'
      loading={isImporting}
      onClick={() => handleClickLoadExternal()}
      className='bg-transparent! text-white!'
    >
      <span className='icon-[mdi--database-plus] size-5' />
      {t('emulator.loadExternalState')}
    </Button>
  )
}
