import { Button } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import { Link } from 'react-router'

export function HeroMain() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <img alt='logo' className='size-40' src='/assets/logo/logo-192x192.png' />
      <div className='motion-preset-expand motion-delay-300 relative mt-8 rounded-2xl'>
        <h1
          className='text-(--accent-9) m-4 bg-clip-text text-6xl font-[Roboto_Slab_Variable] font-semibold'
          style={{
            textShadow: range(1, 13)
              .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
              .join(','),
          }}
        >
          RetroAssembly
        </h1>
      </div>

      <div className='motion-preset-fade motion-delay-600 relative mt-6'>
        <div className='overflow-hidden rounded p-2 font-[Roboto_Slab_Variable] text-neutral-500'>
          Your personal retro game collection cabinet in your browser.
        </div>
      </div>

      <div className='motion-delay-900 motion-preset-fade motion-duration-2000 mt-20 flex gap-4'>
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
  )
}
