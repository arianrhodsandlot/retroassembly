import { Badge } from '@radix-ui/themes'
import { clsx } from 'clsx'
import ky from 'ky'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import type { State } from '@/controllers/get-states.ts'
import { getFileUrl } from '@/pages/library/utils/file.ts'
import { humanizeDate } from '@/utils/misc.ts'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'

export function GameState({ state }: { state: State }) {
  const { hide, setIsPending } = useGameOverlay()
  const { core, emulator } = useEmulator()
  const [loaded, setLoaded] = useState(false)
  const { isMutating, trigger: loadState } = useSWRMutation(
    getFileUrl(state.fileId),
    async (url) => {
      if (emulator) {
        await emulator.loadState(ky(url))
        emulator.resume()
      }
    },
    {
      async onSuccess() {
        await hide()
      },
    },
  )

  const loadable = core === state.core
  const disabled = !loadable || isMutating

  async function handleClick() {
    setIsPending(true)
    await loadState()
    setIsPending(false)
  }

  function handleLoaded() {
    setLoaded(true)
  }

  return (
    <button
      className={clsx(
        'border-(--color-background) bg-(--color-background) flex h-36 w-48 shrink-0 flex-col overflow-hidden rounded border-4 shadow',
        { 'cursor-default': isMutating },
      )}
      data-sn-enabled
      data-sn-focus-style={JSON.stringify({
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      })}
      disabled={disabled}
      key={state.id}
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
          onError={handleLoaded}
          onLoad={handleLoaded}
          src={getFileUrl(state.thumbnailFileId)}
        />
        {loadable ? null : (
          <div className='absolute bottom-0 right-0  rounded-tl-lg bg-black px-1 py-0.5 text-xs text-white'>
            {state.core}
          </div>
        )}
      </div>
      <div
        className={clsx('text-(--color-text) mt-1 flex h-6 w-full items-center justify-center gap-1 text-xs', {
          'opacity-50': !loadable,
        })}
      >
        {isMutating ? (
          <span className='icon-[svg-spinners--180-ring] text-(--accent-9) block size-3' />
        ) : (
          <>
            Saved at <Badge>{humanizeDate(state.createdAt)}</Badge>
          </>
        )}
      </div>
    </button>
  )
}
