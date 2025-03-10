import { uniq } from 'es-toolkit'
import { getRomGoodcodes } from '@/utils/rom.ts'
import { DistrictIcon } from './district-icon.tsx'

export function GameTitle({ rom }) {
  const goodcodes = getRomGoodcodes(rom)

  const { countries, revision, version = {} } = goodcodes.codes
  const districts: string[] = uniq(countries?.map(({ code }) => code))

  return (
    <div className='mt-2 line-clamp-2 text-center text-sm font-semibold'>
      {districts?.map((district) => (
        <DistrictIcon district={district} key={district} />
      ))}

      {goodcodes.rom}

      {revision !== undefined && (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[octicon--versions-16] size-4 align-middle' />
          {revision > 1 && (
            <span className='ml-2 h-4 align-middle font-["Noto_Mono",ui-monospace,monospace]'>{revision}</span>
          )}
        </span>
      )}

      {version.alpha ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--alpha] size-4 align-middle' />
        </span>
      ) : version.beta ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--beta] size-4 align-middle' />
        </span>
      ) : version.prototype ? (
        <span className='ml-2 inline-block rounded bg-gray-300 px-1'>
          <span className='icon-[mdi--flask] size-4 align-middle' />
        </span>
      ) : null}
    </div>
  )
}
