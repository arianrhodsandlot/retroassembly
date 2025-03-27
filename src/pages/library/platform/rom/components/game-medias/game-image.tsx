import { useToggle } from '@react-hookz/web'
import ky from 'ky'
import useSWRImmutable from 'swr/immutable'

async function checkImage(url: string) {
  try {
    await ky.head(url)
    return true
  } catch {}
  return false
}

export function GameImage({ alt, src }: { alt: string; src: string }) {
  const [error, toggleError] = useToggle()
  const { data: valid } = useSWRImmutable(src, () => checkImage(src))

  if (error || !valid) {
    return
  }

  return <img alt={alt} className='h-48 w-auto' onError={toggleError} src={src} />
}
