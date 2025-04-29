import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'

export function ButtonSection() {
  return (
    <section className='relative py-20'>
      <div className='relative mx-auto max-w-6xl'>
        <h2 className='motion-preset-oscillate motion-duration-2000 mb-6 flex items-center justify-center gap-2 text-3xl text-neutral-500'>
          Start to enjoy retro gaming now!
        </h2>
        <div className='flex items-center justify-center gap-4 py-8'>
          <Button asChild radius='small' size='4' type='button'>
            <Link reloadDocument to='/demo'>
              <span className='icon-[mdi--presentation-play]' />
              View demo
            </Link>
          </Button>

          <Button asChild radius='small' size='4' type='button' variant='outline'>
            <Link className='!border-2 !bg-white !shadow-none' reloadDocument to='/library'>
              <span className='icon-[mdi--bookshelf]' />
              My library
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
