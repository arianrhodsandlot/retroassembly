import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'

export function FixedHeader() {
  return (
    <div className='z-1 border-b-(--accent-9) bg-(--accent-9) fixed flex w-full items-center justify-between border-b px-8 py-4 text-white shadow shadow-black/30'>
      <Link className='font-extrabold' to='/'>
        <img
          alt='RetroAssembly logo'
          className='motion-preset-expand'
          height={32}
          src='/assets/logo/logo-512x512.png'
          width={32}
        />
      </Link>
      <div className='flex items-center gap-4'>
        <a href='https://github.com/arianrhodsandlot/retro-assembly' rel='noreferrer noopener' target='_blank'>
          <img alt='GitHub' src='https://img.shields.io/github/stars/arianrhodsandlot/retro-assembly?style=social' />
        </a>

        <Button asChild size='2' type='button' variant='outline'>
          <Link className='!bg-white' reloadDocument to='/library'>
            <span className='icon-[mdi--bookshelf]' />
            My library
          </Link>
        </Button>
      </div>
    </div>
  )
}
