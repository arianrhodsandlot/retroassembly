import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import useSWRImmutable from 'swr/immutable'

const imageExtensions = ['.gif', '.jpg', '.jpeg', '.png', '.webp']

interface CbzCoverProps {
  src: string
}

export function CbzCover({ src }: Readonly<CbzCoverProps>) {
  const {
    data: coverUrl,
    error,
    isLoading,
  } = useSWRImmutable(src, async (src) => {
    const response = await fetch(src)
    if (!response.ok) {
      throw new Error(`Failed to fetch CBZ: ${response.status}`)
    }
    const blob = await response.blob()
    const reader = new ZipReader(new BlobReader(blob))
    const entries = await reader.getEntries()
    const firstImage = entries
      .filter((entry) => !entry.directory)
      .filter((entry) => {
        const name = entry.filename.toLowerCase()
        return imageExtensions.some((ext) => name.endsWith(ext))
      })
      .toSorted((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))
      .at(0)

    if (firstImage) {
      const data = await firstImage.getData?.(new BlobWriter())
      if (data) {
        return URL.createObjectURL(data)
      }
    }
  })

  if (isLoading) {
    return (
      <div className='flex size-full items-center justify-center'>
        <span className='icon-[svg-spinners--180-ring] size-5 animate-spin text-neutral-400' />
      </div>
    )
  }

  if (error || !coverUrl) {
    return (
      <div className='flex size-full items-center justify-center'>
        <span className='icon-[mdi--book-open-page-variant] size-5 text-neutral-500' />
      </div>
    )
  }

  return <img alt='Cover' className='size-full object-cover' src={coverUrl} />
}
