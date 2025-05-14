import { Link } from 'react-router'

export function FixedHeader() {
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
      <div className='flex items-center gap-6 text-2xl'>
        <a
          href='https://github.com/arianrhodsandlot/retro-assembly'
          rel='noreferrer noopener'
          target='_blank'
          title='Discord'
        >
          <span className='icon-[simple-icons--discord]' />
        </a>
        <a
          href='https://github.com/arianrhodsandlot/retroassembly'
          rel='noreferrer noopener'
          target='_blank'
          title='GitHub'
        >
          <span className='icon-[simple-icons--github]' />
        </a>
      </div>
    </div>
  )
}
