import { useLoaderData } from 'react-router'
import type { loader } from '@/pages/routes/library-home.tsx'
import { getRomGoodcodes } from '@/utils/client/library.ts'
import { GameEntryImage } from '../../components/game-entry/game-entry-image.tsx'
import { GameEntry } from '../../components/game-entry/game-entry.tsx'
import { usePreference } from '../../hooks/use-preference.ts'
import { LaunchButton } from '../../platform/rom/components/launch-button.tsx'
import { SectionTitle } from './section-title.tsx'

export function JumpBackInSection() {
  const {
    recentlySavedRoms: [recentlySavedRom, ...restRecentlySavedRoms],
  } = useLoaderData<typeof loader>()
  const { preference } = usePreference()

  if (!recentlySavedRom) {
    return
  }

  const sizeMap = { 'extra-small': 36, 'extra large': 60, large: 54, medium: 48, small: 42 }
  const size = sizeMap[preference.ui.libraryCoverSize]
  const gridTemplateColumns = `repeat(auto-fill,minmax(min(calc(var(--spacing)*${size}),var(--min-width)),1fr))`
  const maxHeight = `calc(var(--spacing)*${size + 10})`

  return (
    <section>
      <SectionTitle icon='icon-[mdi--location-enter]'>Jump back in</SectionTitle>

      <div className='bg-(--gray-a4) mt-4 flex gap-4 rounded p-8'>
        <div className='flex w-64 justify-center'>
          <GameEntryImage rom={recentlySavedRom} />
        </div>
        <div>
          <h3 className='mb-4 text-3xl font-semibold'>{getRomGoodcodes(recentlySavedRom).rom}</h3>
          <LaunchButton>
            <span className='icon-[mdi--motion-play-outline] motion-preset-pulse-lg motion-duration-1500' />
            <span className='w-52 text-2xl font-semibold'>Continue</span>
          </LaunchButton>
        </div>
      </div>

      {restRecentlySavedRoms.length > 0 ? (
        <div className='mt-4 rounded p-4'>
          <div
            className='grid overflow-hidden [--min-width:150px] lg:[--min-width:100%]'
            style={{ gridTemplateColumns, maxHeight }}
          >
            {restRecentlySavedRoms.map((rom) => (
              <GameEntry key={rom.id} rom={rom} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
