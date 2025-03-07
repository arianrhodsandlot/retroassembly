import { groupBy } from 'es-toolkit'
import { ScrollContainer } from '../../../components/scroll-container.tsx'
import { useGameStates } from '../../hooks/use-game-states.ts'
import { GameState } from './game-state.tsx'

export function GameStates() {
  const { states } = useGameStates()

  if (states.length === 0) {
    return
  }

  const { auto, manual } = groupBy(states, ({ type }) => type)

  return (
    <>
      <h3 className='flex items-center gap-2 text-2xl font-semibold text-white'>
        <span className='icon-[mdi--database] size-7' />
        Saved States
      </h3>
      {manual ? (
        <ScrollContainer>
          <div className='flex flex-nowrap gap-8'>
            {manual.map((state) => (
              <GameState key={state.id} state={state} />
            ))}
          </div>
        </ScrollContainer>
      ) : null}

      {auto ? (
        <div className='overflow-auto'>
          <div className='flex flex-nowrap gap-8'>
            {auto.map((state) => (
              <GameState key={state.id} state={state} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
