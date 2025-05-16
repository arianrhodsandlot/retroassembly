import { Portal, Theme } from '@radix-ui/themes'
import { platformMap } from '@/constants/platform.ts'
import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Rom } from '@/controllers/get-roms.ts'
import { preferenceAtom } from '@/pages/atoms.ts'
import { HydrationBoundaries } from '@/pages/components/hydration-boundaries.tsx'
import { getRomGoodcodes } from '@/utils/library.ts'
import { platformAtom, romAtom } from '../../atoms.ts'
import LibraryLayout from '../../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../../components/page-breadcrumb.tsx'
import { getHydrateAtoms } from '../../utils/hydrate-atoms.ts'
import { GameCover } from './components/game-cover.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedias } from './components/game-medias/game-medias.tsx'
import { GameOverlay } from './components/game-overlay/game-overlay.tsx'
import { LaunchButton } from './components/launch-button.tsx'
import { PageHooks } from './components/page-hooks.ts'
import { RomAtomGuard } from './components/rom-atom-guard.ts'
import { RomBackground } from './components/rom-background.tsx'

interface RomPageProps {
  pageData: {
    preference: ResolvedPreference
    rom: Rom
  }
}

export default function RomPage({ pageData }: RomPageProps) {
  const { preference, rom } = pageData
  if (!rom) {
    return '404'
  }

  const goodcodes = getRomGoodcodes(rom)
  const { launchboxGame } = rom

  // @ts-expect-error desc is for demo roms
  const overview = launchboxGame?.overview || rom.desc

  return (
    <HydrationBoundaries
      hydrateAtoms={getHydrateAtoms([
        [preferenceAtom, preference],
        [platformAtom, platformMap[rom.platform]],
        [romAtom, rom],
      ])}
    >
      <LibraryLayout title={goodcodes.rom}>
        <MainScrollArea className='z-1 relative flex flex-1' size='2'>
          <PageBreadcrumb />
          <div className='flex min-h-full w-full gap-4 p-4'>
            <div>
              <GameCover rom={rom} />
            </div>

            <div className='flex flex-1 flex-col gap-8'>
              <h1 className='px-8 pt-4 text-3xl font-bold'>{goodcodes.rom}</h1>
              <GameInfo gameInfo={launchboxGame} rom={rom} />
              <div className='px-4'>
                <RomAtomGuard>
                  <LaunchButton />
                </RomAtomGuard>
              </div>
              <div className='flex flex-col gap-4 pl-4 pr-64'>
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
        </Portal>
        <RomAtomGuard>
          <PageHooks />
        </RomAtomGuard>
      </LibraryLayout>
    </HydrationBoundaries>
  )
}
