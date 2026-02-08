import type { MouseEvent } from 'react'
import { generatePath } from 'react-router'
import { routes } from '#@/pages/routes.ts'
import { useSelectedGames } from '../../atoms.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { NavigatableLink } from '../navigatable-link.tsx'
import { FavoriteButton } from './favorite-button.tsx'
import { GameEntryDropdownMenu } from './game-entry-dropdown-menu.tsx'
import { GameEntryImage } from './game-entry-image.tsx'
import { GamePlatform } from './game-platform.tsx'
import { GameTitle } from './game-title.tsx'

export function GameEntry({ rom }) {
  const isDemo = useIsDemo()

  const [selectedGames, setSelectedGames] = useSelectedGames()

  const url = generatePath(isDemo ? routes.demoPlatformRom : routes.libraryPlatformRom, {
    fileName: rom.fileName,
    platform: rom.platform,
  })
  const selecting = selectedGames.length > 0
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (selecting) {
      event.preventDefault()
      setSelectedGames(
        selectedGames.includes(rom.id) ? selectedGames.filter((id) => id !== rom.id) : [...selectedGames, rom.id],
      )
    }
  }

  return (
    <div className='group relative'>
      <NavigatableLink
        className='game-entry flex flex-col items-center justify-center gap-1 lg:p-1'
        onClick={handleClick}
        title={selecting ? `Select ${rom.fileName}` : rom.fileName}
        to={url}
      >
        <GameEntryImage rom={rom} />
        <GamePlatform platform={rom.platform} />
        <GameTitle rom={rom} />
      </NavigatableLink>
      {isDemo ? null : <FavoriteButton rom={rom} />}
      <GameEntryDropdownMenu rom={rom} />
    </div>
  )
}
