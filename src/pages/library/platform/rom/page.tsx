import { Portal, Theme } from '@radix-ui/themes'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Rom } from '@/controllers/get-roms.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import LibraryLayout from '../../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../../components/page-breadcrumb.tsx'
import { GameAnimatePresence } from './components/game-animate-presence.tsx'
import { GameCover } from './components/game-cover.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedias } from './components/game-medias/game-medias.tsx'
import { GameOverlay } from './components/game-overlay/game-overlay.tsx'
import { LaunchButton } from './components/launch-button.tsx'
import { PageHooks } from './components/page-hooks.ts'
import { RomBackground } from './components/rom-background.tsx'

interface RomPageProps {
  pageData: {
    preference: ResolvedPreference
    rom: Rom | undefined
  }
}
export default function RomPage({ pageData }: RomPageProps) {
  const { rom } = pageData
  if (!rom) {
    return '404'
  }

  const goodcodes = getRomGoodcodes(rom)
  const { launchboxGame } = rom

  // @ts-expect-error desc is for demo roms
  const overview = launchboxGame?.overview || rom.desc

  return (
    <LibraryLayout title={goodcodes.rom}>
      <MainScrollArea className='z-1 relative flex flex-1' size='2'>
        <PageBreadcrumb />
        <div className='flex min-h-full w-full flex-col gap-4 p-4 lg:flex-row'>
          <div>
            <GameCover rom={rom} />
          </div>

          <div className='flex flex-1 flex-col gap-8'>
            <h1 className='pt-4 text-3xl font-bold lg:px-8'>{goodcodes.rom}</h1>
            <div className='lg:hidden'>
              <LaunchButton />
            </div>
            <GameInfo gameInfo={launchboxGame} rom={rom} />
            <div className='hidden px-4 lg:block'>
              <LaunchButton />
            </div>
            <div className='flex flex-col gap-4 lg:pl-4 lg:pr-64'>
              <GameMedias />

              {overview ? (
                <div className='prose-neutral prose max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable]'>
                  {overview}
                </div>
              ) : null}

              {launchboxGame?.wikipediaUrl ? (
                <div>
                  <a
                    className='text-(--accent-9) inline-flex items-center gap-2 underline'
                    href={launchboxGame.wikipediaUrl}
                    rel='noreferrer'
                    target='_blank'
                  >
                    <span className='icon-[mdi--wikipedia] size-6' /> Read more on Wikipedia.
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </MainScrollArea>

      <RomBackground rom={rom} />

      <Portal>
        <Theme accentColor='red'>
          <GameOverlay />
        </Theme>
        <GameAnimatePresence />
      </Portal>
      <PageHooks />
    </LibraryLayout>
  )
}
