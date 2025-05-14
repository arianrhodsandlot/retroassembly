import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'
import background from './button-section-background.svg'

export function ButtonSection() {
  return (
    <section className='relative py-20'>
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage: `url("${background}"), url("${background}")`,
          backgroundPosition: 'top 0 left 0, top 48px left 48px',
          backgroundRepeat: 'repeat',
          backgroundSize: '192px 96px',
        }}
      />
      <div className='relative mx-auto max-w-2xl rounded-xl bg-white py-10 shadow-[0_0_32px_rgba(0,0,0,0.1)]'>
        <h2 className='text-(--accent-9) mb-6 flex items-center justify-center gap-2 text-3xl font-semibold'>
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
