import { GameEntry } from '../../components/game-entry/game-entry.tsx'
import { usePreference } from '../../hooks/use-preference.ts'
import { SectionTitle } from './section-title.tsx'

export function GeneralSection({ icon, roms, title }: { icon: string; roms: any[]; title: string }) {
  const { preference } = usePreference()
  const sizeMap = { 'extra-small': 36, 'extra large': 60, large: 54, medium: 48, small: 42 }
  const size = sizeMap[preference.ui.libraryCoverSize]
  const gridTemplateColumns = `repeat(auto-fill,minmax(min(calc(var(--spacing)*${size}),var(--min-width)),1fr))`
  const maxHeight = `calc(var(--spacing)*${size + 10})`

  return (
    <section>
      <SectionTitle icon={icon}>{title}</SectionTitle>

      <div className='rounded p-4'>
        <div
          className='grid overflow-hidden [--min-width:150px] lg:[--min-width:100%]'
          style={{ gridTemplateColumns, maxHeight }}
        >
          {roms.map((rom) => (
            <GameEntry key={rom.id} rom={rom} />
          ))}
        </div>
      </div>
    </section>
  )
}
