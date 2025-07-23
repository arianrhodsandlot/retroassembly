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
  const { emulator } = useEmulator()
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

  function handleLoaded() {
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
      <div className={clsx('relative flex w-full flex-1 items-center justify-center bg-black')}>
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
      </div>
      <div className='flex h-5 w-full items-center justify-center gap-1 text-xs text-zinc-600'>
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
