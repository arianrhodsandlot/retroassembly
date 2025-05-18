import { Button } from '@radix-ui/themes'
import { Link, useLocation } from 'react-router'
import { getPlatformIcon } from '@/utils/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'
import { UploadButton } from '../../platform/components/upload-button.tsx'
import { UploadSelectButton } from '../../platform/components/upload-select-button.tsx'

export function GameListEmpty() {
  const { pathname } = useLocation()
  const platform = usePlatform()

  const isLibrary = pathname === '/library'
  const isHistory = pathname === '/library/history'

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-16 text-xl'>
      <span className='icon-[mdi--package-variant] size-32 text-zinc-300' />
      {isLibrary ? (
        <>
          <div className='text-zinc-400'>There are no games in your library.</div>
          <div className='text-zinc-400'>
            <UploadSelectButton variant='solid' /> some ROMs to get started.
          </div>
        </>
      ) : null}

      {isHistory ? (
        <>
          <div className='text-zinc-400'>You haven't played any games yet.</div>
          <div className='text-zinc-400'>
            Play some games from your{' '}
            <Button asChild variant='solid'>
              <Link to='/library'>
                <span className='icon-[mdi--bookshelf] ' /> Library
              </Link>
            </Button>
            .
          </div>
        </>
      ) : null}

      {platform ? (
        <>
          <div className='flex items-center gap-1 text-zinc-400'>
            There are no games for{' '}
            <img alt={platform?.displayName} className='size-7' src={getPlatformIcon(platform.name)} />{' '}
            {platform?.displayName} in your library.
          </div>
          <div className='text-zinc-400'>
            <UploadButton platform={platform?.name} variant='solid' /> some ROMs to get started.
          </div>
        </>
      ) : null}
    </div>
  )
}
