import { Badge } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import type { client, InferResponseType } from '#@/api/client.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { getFileUrl } from '#@/pages/library/utils/file.ts'
import { dateFormatMap } from '#@/utils/isomorphic/i18n.ts'
import { humanizeDate } from '#@/utils/isomorphic/misc.ts'
import { useEmulator } from '../hooks/use-emulator.ts'
import { useGameOverlay } from '../hooks/use-game-overlay.ts'
import { GameStateDelete } from './game-state-delete.tsx'

export function GameState({ state }: Readonly<{ state: InferResponseType<typeof client.states.$get>[number] }>) {
  const { i18n, t } = useTranslation()
  const { preference } = usePreference()
  const { hide, setIsPending } = useGameOverlay()
  const { core, emulator } = useEmulator()
  const [loaded, setLoaded] = useState(false)
  const { isMutating, trigger: loadState } = useSWRMutation(
    getFileUrl(state.fileId),
    (url) => emulator?.loadState(url),
    { onSuccess: hide },
  )

  const loadable = core === state.core
  const disabled = !loadable || isMutating
  const dateFormat = preference.ui.dateFormat === 'auto' ? dateFormatMap[i18n.language] : preference.ui.dateFormat

  async function handleClick() {
    setIsPending(true)
    try {
      await loadState()
    } finally {
      setIsPending(false)
    }
  }

  function handleLoaded() {
    setLoaded(true)
  }

  return (
    <div className='relative'>
      <button
        className={clsx(
          'flex h-36 w-48 shrink-0 flex-col overflow-hidden rounded border-4 border-(--color-background) bg-(--color-background) shadow',
          { 'cursor-default': isMutating },
        )}
        data-sn-enabled
        data-sn-focus-style={JSON.stringify({
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        })}
        disabled={disabled}
        onClick={handleClick}
        type='button'
      >
        <div
          className={clsx('relative flex w-full flex-1 items-center justify-center bg-black', {
            'opacity-50': !loadable,
          })}
        >
          {loaded ? null : <span className='icon-[svg-spinners--180-ring]' />}
          <img
            alt={state.id}
            className={clsx('absolute inset-0 size-full object-contain transition-opacity', {
              'opacity-0': !loaded,
              'opacity-80': isMutating,
            })}
            loading='lazy'
            onError={handleLoaded}
            onLoad={handleLoaded}
            src={getFileUrl(state.thumbnailFileId)}
          />
          {loadable ? null : (
            <div className='absolute right-0 bottom-0 rounded-tl-lg bg-black px-1 py-0.5 text-xs text-white'>
              {state.core}
            </div>
          )}
        </div>
        <div
          className={clsx('mt-1 ml-1 flex h-6 w-full items-center justify-start gap-1 text-xs text-(--color-text)', {
            'opacity-50': !loadable,
          })}
        >
          {isMutating ? (
            <span className='icon-[svg-spinners--180-ring] block size-3 text-(--accent-9)' />
          ) : (
            <>
              {t('Saved at')}{' '}
              <Badge className='origin-left scale-90'>{humanizeDate(state.createdAt, dateFormat)}</Badge>
            </>
          )}
        </div>
      </button>
      <GameStateDelete id={state.id} />
    </div>
  )
}
