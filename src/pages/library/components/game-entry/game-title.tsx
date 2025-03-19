import { Badge } from '@radix-ui/themes'
import { compact } from 'es-toolkit'
import { getRomGoodcodes } from '@/utils/rom.ts'
import { DistrictIcon } from './district-icon.tsx'

export function GameTitle({ rom }) {
  const goodcodes = getRomGoodcodes(rom)

  const { countries, revision, version = {} } = goodcodes.codes
  const districts = new Set(countries?.map(({ code }) => code))

  const revisionText = revision ? `Rev ${revision}` : ''
  const versionText = Object.keys(version)
    .filter((text) => text !== 'stable')
    .join(' ')

  if (rom.platform === 'arcade') {
    return <div className='mt-2 text-center text-sm font-semibold'>{goodcodes.file.slice(4)}</div>
  }

  return (
    <div className='mt-2 text-center text-sm font-semibold'>
      {[...districts].map((district) => (
        <DistrictIcon district={district} key={district} />
      ))}

      {goodcodes.rom}

      {compact([revisionText, versionText]).map((text) => (
        <Badge className='mx-0.5 capitalize' key={text} size='2'>
          {text}
        </Badge>
      ))}
    </div>
  )
}
