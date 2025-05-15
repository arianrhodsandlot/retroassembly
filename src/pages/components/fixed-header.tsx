import { Button } from '@radix-ui/themes'
import { Link } from 'react-router'
import { links } from '@/constants/links.ts'

export function FixedHeader({ currentUser }: { currentUser?: any }) {
  return (
    <div className='border-b-(--accent-9) bg-(--accent-9) fixed z-10 flex w-full items-center justify-between border-b px-8 py-4 text-white shadow shadow-black/30'>
      <Link className='font-extrabold' to='/'>
        <img
          alt='RetroAssembly logo'
          className='motion-preset-expand'
          height={32}
          src='/assets/logo/logo-512x512.png'
          width={32}
        />
      </Link>
      <div className='flex items-center gap-4 text-xl'>
        {links.map((link) => (
          <a
            className='flex items-center '
            href='https://github.com/arianrhodsandlot/retro-assembly'
            key={link.name}
            rel='noreferrer noopener'
            target='_blank'
            title={link.text}
          >
            <span className={link.icon} />
          </a>
        ))}

        <div className='h-5 w-px bg-white/50' />

        {currentUser ? (
          <div className='flex items-center '>
            <Button asChild size='2' type='button' variant='outline'>
              <Link className='!rounded-full !border-2 !bg-white !shadow-none' reloadDocument to='/library'>
                <span className='icon-[mdi--bookshelf]' />
                Library
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild radius='full' size='2' type='button' variant='outline'>
            <Link className='!border-2 !bg-white !shadow-none' reloadDocument to='/library'>
              <span className='icon-[mdi--user-box]' />
              Log in
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
