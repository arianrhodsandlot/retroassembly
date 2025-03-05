import { useGameStates } from '../../hooks/use-game-states.ts'

export function GameState({ state }) {
  const { loadState } = useGameStates()
  return (
    <button
      className='flex size-52 shrink-0 flex-col overflow-hidden rounded border-4 border-white bg-white shadow'
      key={state.id}
      onClick={loadState}
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
