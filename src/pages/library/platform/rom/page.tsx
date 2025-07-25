import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Rom } from '@/controllers/get-roms.ts'
import type { State } from '@/controllers/get-states.ts'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'
import { getRomGoodcodes } from '@/utils/library.ts'
import LibraryLayout from '../../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../../components/page-breadcrumb.tsx'
import { GameAnimatePresence } from './components/game-animate-presence.tsx'
import { GameButtons } from './components/game-buttons.tsx'
import { GameCover } from './components/game-cover.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedias } from './components/game-medias/game-medias.tsx'
import { GameOverlay } from './components/game-overlay/game-overlay.tsx'
import { PageHooks } from './components/page-hooks.ts'
import { RomBackground } from './components/rom-background.tsx'

interface RomPageProps {
  pageData: {
    preference: ResolvedPreference
    rom: Rom | undefined
    state: State | undefined
  }
}
export default function RomPage({ pageData }: RomPageProps) {
  const { rom, state } = pageData
  if (!rom) {
    return '404'
  }

  const goodcodes = getRomGoodcodes(rom)
  const { launchboxGame } = rom

  // @ts-expect-error desc is for demo roms
  const overview = launchboxGame?.overview || rom.desc

  return (
    <LibraryLayout title={goodcodes.rom}>
      <MainScrollArea>
        <PageBreadcrumb />
        <div className='flex min-h-full w-full flex-col gap-4 p-4 lg:flex-row'>
          <div>
            <GameCover className='top-4 block w-full lg:sticky lg:w-64' rom={rom} />
          </div>

          <div className='flex flex-1 flex-col gap-8'>
            <h1 className='pt-4 text-3xl font-bold lg:px-8'>{goodcodes.rom}</h1>

            <div className='flex flex-col gap-8 lg:flex-col-reverse'>
              <div className='lg:px-4'>
                <GameButtons state={state} />
              </div>
              <GameInfo gameInfo={launchboxGame} rom={rom} />
            </div>

            <div className='flex flex-col gap-4 lg:pl-4'>
              <GameMedias />
              {overview ? (
                <div className='text-(--color-text)/90 prose max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable] lg:pr-64'>
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

      <RadixThemePortal>
        <GameOverlay />
        <GameAnimatePresence />
      </RadixThemePortal>
      <PageHooks />
    </LibraryLayout>
  )
}
