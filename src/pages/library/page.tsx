import type { ResolvedPreference } from '@/constants/preference.ts'
import type { Roms } from '@/controllers/get-roms.ts'
import { GameList } from './components/game-list/game-list.tsx'
import LibraryLayout from './components/library-layout/library-layout.tsx'
import { MainScrollArea } from './components/main-scroll-area.tsx'
import { useIsDemo } from './hooks/use-demo.ts'
import { UploadSelectButton } from './platform/components/upload-select-button.tsx'

interface LibraryPageProps {
  pageData: {
    page: number
    pagination: any
    platformCount: number
    preference: ResolvedPreference
    roms: Roms
  }
}

export default function LibraryPage({ pageData }: Readonly<LibraryPageProps>) {
  const { page, pagination, platformCount, roms } = pageData
  const isDemo = useIsDemo()

  if (page > 1 && roms.length === 0) {
    return <>404</>
  }

  return (
    <LibraryLayout title='Library'>
      <MainScrollArea>
        <div className='flex min-h-full w-full flex-col gap-5 p-4'>
          <div className='relative flex flex-col justify-between pt-4 lg:flex-row lg:px-4'>
            <div>
              <h1 className='text-5xl font-semibold'>Library</h1>
              {isDemo ? (
                <div className='text-(--gray-11) mt-4 flex items-start gap-1 text-sm lg:items-center'>
                  <span className='icon-[mdi--information-outline] mt-1 shrink-0 lg:mt-0' />
                  <span>
                    These free (legal) games are all picked from{' '}
                    <a
                      className='underline'
                      href='https://retrobrews.github.io/'
                      rel='noreferrer noopener'
                      target='_blank'
                    >
                      retrobrews project
                    </a>{' '}
                    for demonstration.
                  </span>
                </div>
              ) : null}
            </div>
            {isDemo ? null : (
              <div className='mt-4 flex flex-col items-end gap-4 lg:mt-0 lg:flex-row lg:items-center lg:pr-4'>
                <div className='text-(--gray-11) flex items-center justify-end gap-2'>
                  <span className='icon-[mdi--bar-chart] text-(--color-text)' />
                  <span className='text-(--accent-9) font-semibold'>{pagination.total}</span> games for{' '}
                  <span className='text-(--accent-9) font-semibold'>{platformCount}</span>{' '}
                  {platformCount === 1 ? 'platform' : 'platforms'} in total.
                </div>
                <UploadSelectButton />
              </div>
            )}
          </div>
          <GameList key={`library-${page}`} pagination={pagination} />
        </div>
      </MainScrollArea>
    </LibraryLayout>
  )
}
