import { usePreference } from '../hooks/use-preference.ts'
import { GameEntry } from './game-entry/game-entry.tsx'

const sizeMap = { 'extra-small': 36, 'extra large': 60, large: 54, medium: 48, small: 42 }

export function GameEntryGrid({ roms }: { roms: any[] }) {
  const { preference } = usePreference()
  const size = sizeMap[preference.ui.libraryCoverSize]

  const gridTemplateColumns = `repeat(auto-fill,minmax(min(calc(var(--spacing)*${size}),var(--min-width)),1fr))`

  return (
    <div className='grid [--min-width:150px] lg:[--min-width:100%]' style={{ gridTemplateColumns }}>
      {roms.map((rom) => (
        <GameEntry key={rom.id} rom={rom} />
      ))}
    </div>
  )
}
