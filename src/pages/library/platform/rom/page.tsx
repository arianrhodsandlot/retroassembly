import { useLoaderData } from 'react-router'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'
import type { loader } from '@/pages/routes/library-platform-rom.tsx'
import { getRomGoodcodes } from '@/utils/library.ts'
import LibraryLayout from '../../components/library-layout/library-layout.tsx'
import { MainScrollArea } from '../../components/main-scroll-area.tsx'
import { PageBreadcrumb } from '../../components/page-breadcrumb.tsx'
import { GameAnimatePresence } from './components/game-animate-presence.tsx'
import { GameButtons } from './components/game-buttons.tsx'
import { GameCover } from './components/game-cover.tsx'
import { GameInfoDialog } from './components/game-info-dialog/game-info-dialog.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedia } from './components/game-media/game-media.tsx'
import { GameMediaDialog } from './components/game-media-dialog/game-media-dialog.tsx'
import { GameOverlay } from './components/game-overlay/game-overlay.tsx'
import { PageHooks } from './components/page-hooks.ts'
import { RomBackground } from './components/rom-background.tsx'

export default function RomPage() {
  const { rom, state } = useLoaderData<typeof loader>()
  if (!rom) {
    return <>404</>
  }

  const goodcodes = getRomGoodcodes(rom)
  const { launchboxGame } = rom

  const overview = rom.gameDescription || launchboxGame?.overview

  return (
    <LibraryLayout>
      <MainScrollArea>
        <PageBreadcrumb />
        <div className='flex min-h-full w-full flex-col gap-4 p-4 lg:flex-row'>
          <div className='group lg:sticky'>
            <GameCover className='top-4 block w-full lg:w-64' parallax rom={rom} />

            <div className='mt-2 flex justify-end px-1'>
              <GameMediaDialog />
            </div>
          </div>

          <div className='flex flex-1 flex-col gap-8'>
            <h1 className='pt-4 text-3xl font-bold lg:px-8'>{goodcodes.rom}</h1>

            <div className='flex flex-col gap-8 lg:flex-col-reverse'>
              <div className='lg:px-4'>
                <GameButtons state={state} />
              </div>
              <GameInfo rom={rom} />
            </div>

            <div className='flex flex-col gap-6'>
              <GameMedia />
              <div className='text-(--color-text)/90 prose group max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable] lg:mr-64 lg:pl-4'>
                {overview}
                <div className='mt-1 flex justify-end'>
                  <GameInfoDialog autoFocusField='gameDescription' />
                </div>
              </div>

              {launchboxGame?.wikipediaUrl ? (
                <div>
                  <a
                    className='text-(--accent-9) inline-flex items-center gap-2 underline'
                    href={launchboxGame.wikipediaUrl}
                    rel='noreferrer noopener'
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
