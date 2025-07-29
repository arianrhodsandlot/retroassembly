import { range } from 'es-toolkit'
import { metadata } from '@/constants/metadata.ts'
import { ButtonLinks } from '../button-links.tsx'

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
        <div className='text-(--gray-10) overflow-hidden rounded p-2 text-xl font-[Roboto_Slab_Variable]'>
          {metadata.description}
        </div>
      </div>
      <ButtonLinks />
      <a
        className='mt-4 flex items-center gap-2 text-xs underline opacity-80'
        href='https://github.com/arianrhodsandlot/retroassembly#option-2-self-host-with-docker'
      >
        <span className='icon-[mdi--docker] motion-preset-oscillate motion-duration-2000 relative -top-0.5 text-2xl text-[#1d63ed]' />
        Self-Hosting with Docker
      </a>
    </div>
  )
}
