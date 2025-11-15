import type { ReactNode } from 'react'
import { GameEntryGrid } from '../../components/game-entry-grid.tsx'
import { SectionTitle } from './section-title.tsx'

export function GeneralSection({
  className,
  icon,
  link,
  roms,
  suffix,
  title,
}: {
  className?: string
  icon: string
  link: string
  roms: any[]
  suffix?: ReactNode
  title: string
}) {
  if (roms.length > 0) {
    return (
      <section className={className}>
        <SectionTitle icon={icon} link={link} suffix={suffix}>
          {title}
        </SectionTitle>

        <div className='rounded p-4'>
          <GameEntryGrid roms={roms} />
        </div>
      </section>
    )
  }
}
