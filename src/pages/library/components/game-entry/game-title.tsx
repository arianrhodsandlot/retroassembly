import { Badge } from '@radix-ui/themes'
import { compact } from 'es-toolkit'
import { getRomGoodcodes } from '@/utils/library.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { DistrictIcon } from '../district-icon.tsx'

export function GameTitle({ rom }) {
  const { preference } = usePreference()
  const goodcodes = getRomGoodcodes(rom)

  const { countries, revision, version = {} } = goodcodes.codes
  const districts = new Set(countries?.map(({ code }) => code))

  const revisionText = revision ? `Rev ${revision}` : ''
  const versionText = Object.keys(version)
    .filter((text) => text !== 'stable')
    .join(' ')

  if (!preference.ui.showTitle) {
    return <div className='h-8' />
  }

  if (rom.platform === 'arcade1') {
    return (
      <div className='line-clamp-3 h-16 overflow-hidden text-center text-sm font-semibold'>
        {goodcodes.file.slice(4)}
      </div>
    )
  }

  return (
    <div className='line-clamp-3 h-16 overflow-hidden text-center text-sm font-semibold'>
      {preference.ui.showDistrictOnTitle
        ? [...districts].map((district) => <DistrictIcon district={district} key={district} />)
        : null}

      {goodcodes.rom}

      {compact([revisionText, versionText]).map((text) => (
        <Badge className='mx-0.5 capitalize' key={text} size='1'>
          {text}
        </Badge>
      ))}
    </div>
  )
}
