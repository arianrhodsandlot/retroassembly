import { Link } from 'react-router'
import type { SearchRoms } from '@/controllers/search-roms.ts'
import { useSpatialNavigationPaused } from '@/pages/library/atoms.ts'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useRomCover } from '@/pages/library/hooks/use-rom-cover.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { useShowSearchModal } from '../atoms.ts'

export function SearchResultItem({ rom }: Readonly<{ rom: SearchRoms[number] }>) {
  const { data: cover } = useRomCover(rom)
  const goodcodes = getRomGoodcodes(rom)
  const isDemo = useIsDemo()
  const [, setShowSearchModal] = useShowSearchModal()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  function handleClick() {
    setSpatialNavigationPaused(false)
    setShowSearchModal(false)
  }

  const romUrl = isDemo
    ? `/demo/platform/${rom.platform}/rom/${encodeURIComponent(rom.fileName)}`
    : `/library/platform/${rom.platform}/rom/${encodeURIComponent(rom.fileName)}`

  return (
    <li className='p-1'>
      <Link
        className='hover:bg-(--accent-9) hover:text-(--color-background) flex items-center gap-2 rounded-sm p-1'
        onClick={handleClick}
        to={romUrl}
      >
        <img
          alt={goodcodes.rom}
          className='size-12 shrink-0 rounded object-contain object-center'
          src={cover?.src || ''}
        />
        <span className='truncate'>{goodcodes.rom}</span>
      </Link>
    </li>
  )
}
