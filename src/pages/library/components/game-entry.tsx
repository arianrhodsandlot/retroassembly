'use client'
import clsx from 'clsx'
import { Link } from 'waku/router/client'
import { getRomTitle } from '@/utils/rom.ts'
import { useRomCover } from '../hooks/use-rom-cover.ts'

export function GameEntry({ rom, width }) {
  const name = getRomTitle(rom)
  const { data: cover, isLoading } = useRomCover(rom)

  return (
    <div className='relative'>
      <Link
        className='block'
        style={{ width: width || 'auto' }}
        to={`/library/platform/${encodeURIComponent(rom.platform)}/rom/${encodeURIComponent(rom.file_name)}`}
        unstable_pending={
          <div className='z-1 absolute inset-0'>
            <div className='grid h-4/5 w-full place-items-center'>
              <div className='backdrop-blur-xs rounded-full bg-white/40 p-1.5'>
                <span className='icon-[svg-spinners--180-ring] block size-6 text-[var(--theme)]' />
              </div>
            </div>
          </div>
        }
      >
        <div className='flex aspect-square size-full items-center justify-center'>
          {isLoading ? <div className='size-4/5 rounded bg-zinc-200' /> : null}

          {cover ? (
            <img
              alt={name}
              className={clsx('max-w-4/5 max-h-full rounded object-contain drop-shadow-lg', {
                rounded: cover.type === 'rom',
              })}
              src={cover.src}
            />
          ) : null}
        </div>

        <div className='mt-2 line-clamp-2 text-center text-sm font-semibold'>{name}</div>
      </Link>
    </div>
  )
}
