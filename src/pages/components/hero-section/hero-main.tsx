import { Button } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import { Link } from 'react-router'
import { metadata } from '@/constants/metadata.ts'

export function HeroMain() {
  return (
    <div className='flex flex-col items-center justify-center'>
      <img alt='logo' className='size-40' src='/assets/logo/logo-192x192.png' />
      <div className='relative rounded-2xl'>
        <h1
          className='text-(--accent-9) m-4 bg-clip-text text-4xl font-[Roboto_Slab_Variable] font-semibold lg:text-6xl'
          style={{
            textShadow: range(1, 13)
              .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
              .join(','),
          }}
        >
          {metadata.title}
        </h1>
      </div>

      <div className='relative mt-4 px-10 text-center'>
        <div className='overflow-hidden rounded p-2 text-xl font-[Roboto_Slab_Variable] text-neutral-500'>
          Your personal retro game collection cabinet in your browser.
        </div>
      </div>

      <div className='mt-8 flex flex-col gap-4 lg:flex-row lg:*:!w-48'>
        <Button asChild radius='small' size='4' type='button'>
          <Link reloadDocument to='/demo'>
            <span className='icon-[mdi--presentation-play]' />
            Live demo
          </Link>
        </Button>

        <Button asChild radius='small' size='4' type='button' variant='outline'>
          <Link className='!border-2 !bg-white !shadow-none' reloadDocument to='/library'>
            <span className='icon-[mdi--bookshelf]' />
            Library
          </Link>
        </Button>
      </div>
    </div>
  )
}
