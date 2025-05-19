import { groupBy } from 'es-toolkit'
import { ScrollArea } from '@/pages/components/radix-themes.ts'
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

      {[
        { states: manual, type: 'manual' },
        { states: auto, type: 'auto' },
      ]
        .filter(({ states }) => states)
        .map(({ states, type }) => (
          <ScrollArea key={type}>
            <div className='flex flex-nowrap gap-8'>
              {states.map((state) => (
                <GameState key={state.id} state={state} />
              ))}
            </div>
          </ScrollArea>
        ))}
    </>
  )
}
