import { attemptAsync } from 'es-toolkit'
import useSWRImmutable from 'swr/immutable'
import { imageLoaded } from '#@/utils/client/image.ts'
import { getRomLibretroThumbnail } from '#@/utils/client/library.ts'

async function getRomLogo(rom) {
  const url = getRomLibretroThumbnail(rom, 'logo')
  const [error] = await attemptAsync(() => imageLoaded(url))
  if (!error) {
    return url
  }
  const response = await fetch(url)
  const text = await response.text()
  if (!text.endsWith('.png')) {
    return ''
  }

  const replacedUrl = new URL(text, url).href
  const [replacedUrlError] = await attemptAsync(() => imageLoaded(replacedUrl))
  if (!replacedUrlError) {
    return replacedUrl
  }
  return ''
}

export function GameLogo({ goodcodes, rom, ...props }) {
  const { data } = useSWRImmutable(getRomLibretroThumbnail(rom, 'logo'), () => getRomLogo(rom))

  if (data) {
    return <img alt={`${goodcodes.rom}`} loading='lazy' src={data} {...props} />
  }
}
