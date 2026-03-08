import { ScrollArea } from '@radix-ui/themes'
import { groupBy } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { useGameStates } from '../hooks/use-game-states.ts'
import { GameState } from './game-state.tsx'
import { LoadExternalState } from './load-external-state.tsx'

export function GameStates() {
  const { t } = useTranslation()
  const { states } = useGameStates()

  const { auto, manual } = groupBy(states, ({ type }) => type)

  return (
    <>
      <h3 className='flex items-center gap-2 text-2xl font-semibold text-white'>
        <span className='icon-[mdi--database] size-7' />
        {t('Saved States')}
        <span className='flex-1' />
        <LoadExternalState />
      </h3>
      <ScrollArea className='overflow-visible! lg:h-44! lg:overflow-hidden!' size='2'>
        {manual && manual.length > 0 ? (
          <div className='flex flex-col flex-nowrap items-center gap-8 pb-4 lg:flex-row'>
            {manual.map((state) => (
              <GameState key={state.id} state={state} />
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2 py-10 text-lg text-neutral-400'>
            <span className='icon-[mdi--database-outline] text-2xl' />
            {t("You haven't saved any states yet")}
          </div>
        )}
      </ScrollArea>

      {auto && auto.length > 0 ? (
        <>
          <h3 className='mt-2 flex items-center gap-2 text-2xl font-semibold text-white'>
            <span className='icon-[mdi--timer] size-7' />
            {t('Auto Saved States')}
          </h3>
          <ScrollArea className='overflow-visible! lg:h-44! lg:overflow-hidden!' size='2'>
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
