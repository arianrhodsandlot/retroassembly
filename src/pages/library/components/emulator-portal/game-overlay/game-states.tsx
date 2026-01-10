import { ScrollArea } from '@radix-ui/themes'
import { groupBy } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { useGameStates } from '../hooks/use-game-states.ts'
import { GameState } from './game-state.tsx'

export function GameStates() {
  const { t } = useTranslation()
  const { states } = useGameStates()

  if (!states || states.length === 0) {
    return
  }

  const { auto, manual } = groupBy(states, ({ type }) => type)

  return (
    <>
      {manual && manual.length > 0 ? (
        <>
          <h3 className='flex items-center gap-2 text-2xl font-semibold text-white'>
            <span className='icon-[mdi--database] size-7' />
            {t('Saved States')}
          </h3>
          <ScrollArea className='overflow-visible! lg:overflow-hidden! lg:h-44!' size='2'>
            <div className='flex flex-col flex-nowrap items-center gap-8 pb-4 lg:flex-row'>
              {manual.map((state) => (
                <GameState key={state.id} state={state} />
              ))}
            </div>
          </ScrollArea>
        </>
      ) : null}

      {auto && auto.length > 0 ? (
        <>
          <h3 className='mt-2 flex items-center gap-2 text-2xl font-semibold text-white'>
            <span className='icon-[mdi--timer] size-7' />
            {t('Auto Saved States')}
          </h3>
          <ScrollArea className='overflow-visible! lg:overflow-hidden! lg:h-44!' size='2'>
            <div className='flex flex-col flex-nowrap items-center gap-8 pb-4 lg:flex-row'>
              {auto.map((state) => (
                <GameState key={state.id} state={state} />
              ))}
            </div>
          </ScrollArea>
        </>
      ) : null}
    </>
  )
}
