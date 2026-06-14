import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import { useEffect, useRef, useState } from 'react'

const imageExtensions = ['.gif', '.jpg', '.jpeg', '.png', '.webp']

interface CbzViewerProps {
  src: string
}

export function CbzViewer({ src }: Readonly<CbzViewerProps>) {
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const pageUrlsRef = useRef<string[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch(src, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`)
        }
        const blob = await response.blob()
        const reader = new ZipReader(new BlobReader(blob))
        const entries = await reader.getEntries()

        const imageEntries = entries
          .filter((entry) => !entry.directory)
          .filter((entry) => {
            const name = entry.filename.toLowerCase()
            return imageExtensions.some((ext) => name.endsWith(ext))
          })
          .toSorted((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))

        const urls: string[] = []
        for (const entry of imageEntries) {
          const data = await entry.getData?.(new BlobWriter())
          if (data) {
            urls.push(URL.createObjectURL(data))
          }
        }

        if (controller.signal.aborted) {
          return
        }

        pageUrlsRef.current = urls
        setPages(urls)
      } catch {
        if (!controller.signal.aborted) {
          setError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    ;(async () => {
      await load()
    })()

    return () => {
      controller.abort()
      for (const url of pageUrlsRef.current) {
        URL.revokeObjectURL(url)
      }
    }
  }, [src])

  if (loading) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <span className='icon-[svg-spinners--180-ring] size-8 animate-spin text-neutral-400' />
      </div>
    )
  }

  if (error || pages.length === 0) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <span className='text-neutral-400'>Unable to load comic</span>
      </div>
    )
  }

  return (
    <div className='h-full w-full overflow-y-auto'>
      {pages.map((url, index) => (
        <img
          alt={`Page ${index + 1}`}
          className='w-full'
          key={url}
          loading={index > 2 ? 'lazy' : undefined}
          src={url}
        />
      ))}
    </div>
  )
}
