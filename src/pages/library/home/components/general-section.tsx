import { GameEntryGrid } from '../../components/game-entry-grid.tsx'
import { SectionTitle } from './section-title.tsx'

export function GeneralSection({
  className,
  icon,
  roms,
  title,
}: {
  className?: string
  icon: string
  roms: any[]
  title: string
}) {
  return (
    <section className={className}>
      <SectionTitle icon={icon}>{title}</SectionTitle>

      <div className='rounded p-4'>
        <GameEntryGrid roms={roms} />
      </div>
    </section>
  )
}
