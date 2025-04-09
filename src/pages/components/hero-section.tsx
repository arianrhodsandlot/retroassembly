import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'

export function HeroSection() {
  return (
    <section className='flex h-screen min-h-96 flex-col items-center justify-center'>
      <h1 className='text-8xl font-semibold'>RetroAssembly</h1>

      <p className='mt-4 text-2xl'>Your personal retro game collection cabinet in your browser.</p>

      <div className='mt-32 flex gap-4'>
        <Button asChild radius='small' size='4' type='button'>
          <Link reloadDocument to='/library'>
            <span className='icon-[mdi--presentation-play]' />
            View demo
          </Link>
        </Button>

        <Button asChild radius='small' size='4' type='button' variant='soft'>
          <Link reloadDocument to='/library'>
            <span className='icon-[mdi--bookshelf]' />
            My library
          </Link>
        </Button>
      </div>
    </section>
  )
}
