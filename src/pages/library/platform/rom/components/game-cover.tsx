import { useRomCover } from '../../../hooks/use-rom-cover.ts'

export function GameCover({ rom }) {
  const { data: cover, isLoading } = useRomCover(rom)

  if (isLoading) {
    return <div className='sticky top-4 size-64 bg-zinc-200' />
  }

  return cover ? (
    <a className='top-4 block w-full lg:sticky lg:w-64' href={cover.src} rel='noreferrer noopener' target='_blank'>
      <img alt={rom.name} className='block h-auto w-full' src={cover.src} />
    </a>
  ) : null
}
