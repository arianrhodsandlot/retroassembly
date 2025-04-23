import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'

export function HeroMain() {
  return (
    <div className='flex w-1/2 flex-1 flex-col items-center justify-center'>
      <div className='motion-preset-expand motion-delay-300 outline-hidden relative mt-8 overflow-hidden rounded-2xl'>
        <h1 className='text-shadow m-4 bg-clip-text text-7xl font-[Comfortaa_Variable] font-extrabold'>
          RetroAssembly
        </h1>
      </div>

      <div className='motion-preset-expand motion-delay-600 relative mt-6'>
        <div className='overflow-hidden rounded p-2'>Your personal retro game collection cabinet in your browser.</div>
      </div>

      <div className='motion-delay-900 motion-preset-fade motion-duration-4000 mt-20 flex gap-4'>
        <Button asChild radius='small' size='4' type='button'>
          <Link reloadDocument to='/demo'>
            <span className='icon-[mdi--presentation-play]' />
            View demo
          </Link>
        </Button>

        <Button asChild radius='small' size='4' type='button' variant='outline'>
          <Link className='!bg-white' reloadDocument to='/library'>
            <span className='icon-[mdi--bookshelf]' />
            My library
          </Link>
        </Button>
      </div>
    </div>
  )
}
