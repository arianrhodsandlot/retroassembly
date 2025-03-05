import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameState } from './game-state.tsx'

export function GameStates() {
  const { states } = useGameStates()

  return (
    <>
      <div className='overflow-auto'>
        <div className='flex flex-nowrap gap-8'>
          {states?.map((state) => (
            <GameState key={state.id} state={state} />
          ))}
        </div>
      </div>
      <div className='overflow-auto'>
        <div className='flex flex-nowrap gap-8'>
          {states?.map((state) => (
            <GameState key={state.id} state={state} />
          ))}
        </div>
      </div>
    </>
  )
}
