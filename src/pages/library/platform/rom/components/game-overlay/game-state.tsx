import { Badge } from '@radix-ui/themes'
import { clsx } from 'clsx'
import ky from 'ky'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import type { State } from '@/controllers/get-states.ts'
import { humanizeDate } from '@/utils/misc.ts'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'

export function GameState({ state }: { state: State }) {
  const { hide, setIsPending } = useGameOverlay()
  const { emulator } = useEmulator()
  const [loaded, setLoaded] = useState(false)

  const { isMutating, trigger: loadState } = useSWRMutation(
    `/api/v1/files/${encodeURIComponent(state.fileId)}`,
    async (url) => {
      if (emulator) {
        await emulator.loadState(ky(url))
        emulator.resume()
      }
    },
    {
      onSuccess() {
        hide()
      },
    },
  )

  async function handleClick() {
    setIsPending(true)
    await loadState()
    setIsPending(false)
  }

  function handleLoad() {
    setLoaded(true)
  }

  return (
    <button
      className={clsx(
        'flex h-36 w-48 shrink-0 flex-col overflow-hidden rounded border-4 border-white bg-white shadow',
        { 'cursor-default': isMutating },
      )}
      data-sn-enabled
      data-sn-focus-style={JSON.stringify({
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      })}
      disabled={isMutating}
      key={state.id}
      onClick={handleClick}
      type='button'
    >
      <div className={clsx('relative flex-1 bg-black transition-colors')}>
        <img
          alt={state.id}
          className={clsx('absolute size-full object-contain transition-opacity', {
            'opacity-0': !loaded,
            'opacity-80': isMutating,
          })}
          onError={handleLoad}
          onLoad={handleLoad}
          src={`/api/v1/files/${encodeURIComponent(state.thumbnailFileId)}`}
        />

        {state.type === 'auto' ? (
          <div className='absolute bottom-0 right-0 rounded-tl bg-black/50 px-3 py-1 text-xs font-semibold text-white'>
            Auto Saved
          </div>
        ) : null}
      </div>
      <div className='flex h-5 items-center justify-center text-xs text-zinc-600'>
        {isMutating ? (
          <span className='icon-[svg-spinners--180-ring] text-(--accent-9) block size-3' />
        ) : (
          <div>
            Saved at <Badge>{humanizeDate(state.createdAt)}</Badge>
          </div>
        )}
      </div>
    </button>
  )
}
