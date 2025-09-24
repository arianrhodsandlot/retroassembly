import { Button } from '@radix-ui/themes'
import { Link, useLocation } from 'react-router'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'
import { UploadButton } from '../../platform/components/upload-button.tsx'
import { UploadSelectButton } from '../../platform/components/upload-select-button.tsx'

export function GameListEmpty() {
  const { pathname } = useLocation()
  const platform = usePlatform()

  const isLibrary = pathname === '/library'
  const isHistory = pathname === '/library/history'

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-16 text-sm lg:text-xl'>
      <span className='icon-[mdi--package-variant] size-32 text-zinc-300' />
      {isLibrary ? (
        <>
          <div className='text-(--gray-11)'>
            Welcome to RetroAssembly. This is where all ROMs uploaded by you will appear.
          </div>
          <div className='text-(--gray-11)'>
            <UploadSelectButton variant='soft' /> some ROMs to get started.
          </div>
        </>
      ) : null}

      {isHistory ? (
        <>
          <div className='text-(--gray-11)'>You haven't played any games yet.</div>
          <div className='text-(--gray-11)'>
            Play some games from your{' '}
            <Button asChild variant='outline'>
              <Link to='/library'>
                <span className='icon-[mdi--bookshelf] ' /> Library
              </Link>
            </Button>
          </div>
        </>
      ) : null}

      {platform ? (
        <>
          <div className='text-(--gray-11) flex items-center gap-1'>
            There are no games for{' '}
            <img
              alt={platform?.displayName}
              className='hidden size-7 lg:inline-block'
              loading='lazy'
              src={getPlatformIcon(platform.name)}
            />{' '}
            {platform?.displayName} in your library.
          </div>
          <div className='text-(--gray-11) flex items-center gap-1'>
            <UploadButton platform={platform?.name} variant='soft' /> some ROMs to get started.
          </div>
        </>
      ) : null}
    </div>
  )
}
