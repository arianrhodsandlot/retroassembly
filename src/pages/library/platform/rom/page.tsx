import { getRom } from '@/controllers/get-rom.ts'
import { Portal, Theme } from '@/pages/components/radix-themes.ts'
import { getRomGoodcodes } from '@/utils/rom.ts'
import AppLayout from '../../components/app-layout.tsx'
import { GameBackground } from './components/game-background.tsx'
import { GameCover } from './components/game-cover.tsx'
import { GameInfo } from './components/game-info.tsx'
import { GameMedias } from './components/game-medias.tsx'
import { GameOverlay } from './components/game-overlay/game-overlay.tsx'
import { LaunchButton } from './components/launch-button.tsx'
import { RomContextProvider } from './components/rom-context-provider.tsx'
import { RomPageMainScrollArea } from './components/rom-page-main-scroll-area.tsx'

export async function RomPage({ fileName, id, platform }) {
  const rom = await getRom({ fileName: decodeURIComponent(fileName), id, platform: decodeURIComponent(platform) })
  if (!rom) {
    return '404'
  }

  const goodcodes = getRomGoodcodes(rom)
  const { launchboxGame } = rom

  return (
    <RomContextProvider value={rom}>
      <AppLayout title={goodcodes.rom}>
        <RomPageMainScrollArea className='z-1 relative flex flex-1' size='2'>
          <main className='flex min-h-full w-full gap-4 p-4'>
            <div>
              <GameCover rom={rom} />
            </div>

            <div className='flex flex-1 flex-col gap-8'>
              <h1 className='px-8 pt-4 text-3xl font-bold'>{goodcodes.rom}</h1>

              <GameInfo gameInfo={launchboxGame} rom={rom} />

              <div className='px-4'>
                <LaunchButton />
              </div>

              <div className='flex flex-col gap-4 pl-4 pr-64'>
                <GameMedias rom={rom} video={launchboxGame?.video_url} />

                {launchboxGame?.overview ? (
                  <div className='prose-neutral prose max-w-none whitespace-pre-line text-justify font-[Roboto_Slab_Variable]'>
                    {launchboxGame.overview}
                  </div>
                ) : null}

                {launchboxGame?.wikipedia_url ? (
                  <div>
                    <a
                      className='inline-flex items-center gap-2 text-[var(--accent-9)] underline'
                      href={launchboxGame.wikipedia_url}
                      rel='noreferrer'
                      target='_blank'
                    >
                      <span className='icon-[mdi--wikipedia] size-6' /> Read more on Wikipedia.
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </main>
        </RomPageMainScrollArea>
        <GameBackground rom={rom} />
        <Portal>
          <Theme accentColor='red'>
            <GameOverlay rom={rom} />
          </Theme>
        </Portal>
      </AppLayout>
    </RomContextProvider>
  )
}
