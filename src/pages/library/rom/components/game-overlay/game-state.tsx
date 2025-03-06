import ky from 'ky'
import useSWRMutation from 'swr/mutation'
import { useEmulator } from '../../hooks/use-emulator.ts'
import { useGameOverlay } from '../../hooks/use-game-overlay.ts'

export function GameState({ state }) {
  const { setIsPending, toggle } = useGameOverlay()
  const { emulator } = useEmulator()

  const { trigger: loadState } = useSWRMutation(
    `/api/v1/state/${state.id}/content`,
    async (url) => {
      if (emulator) {
        await emulator.loadState(ky(url))
        emulator.resume()
      }
    },
    {
      onSuccess() {
        toggle()
      },
    },
  )

  async function handleClick() {
    setIsPending(true)
    await loadState(state)
    setIsPending(false)
  }

  return (
    <button
      className='flex size-52 shrink-0 flex-col overflow-hidden rounded border-4 border-white bg-white shadow'
      key={state.id}
      onClick={handleClick}
      type='button'
    >
      <img
        alt={state.id}
        className='block flex-1 object-cover'
        src={`/api/v1/file/${state.thumbnail_file_id}/content`}
      />
      <div className='text-sm'>{state.created_at}</div>
    </button>
  )
}
