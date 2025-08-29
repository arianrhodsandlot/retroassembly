import { attemptAsync } from 'es-toolkit'
import useSWRImmutable from 'swr/immutable'
import { http } from '@/utils/http.ts'
import { getRomLibretroThumbnail } from '@/utils/library.ts'

function imageLoaded(src: string) {
  const img = new Image()
  img.src = src
  return new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => resolve())
    img.addEventListener('error', (error) => reject(error))
  })
}

async function getRomLogo(rom) {
  const url = getRomLibretroThumbnail(rom, 'logo')
  const [error] = await attemptAsync(() => imageLoaded(url))
  if (!error) {
    return url
  }
  const text = await http(url).text()
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
    return <img alt={`${goodcodes.rom}`} src={data} {...props} />
  }
}
