import { IconButton } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import clsx from 'clsx'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { getFileUrl } from '@/pages/library/utils/file.ts'
import { api } from '@/utils/http.ts'

export function GameMediaImages() {
  const rom = useRom()
  const [thumbnailFileIds, setThumbnailFileIds] = useState<string[]>(rom.gameThumbnailFileIds?.split(',') || [])

  const { isMutating: isUploadingThumbnail, trigger: uploadThumbnail } = useSWRMutation(
    `roms/${rom.id}/thumbnail`,
    (url, { arg }: { arg: FormData }) => api.post(url, { body: arg }).json<string>(),
  )

  const { isMutating: isDeletingThumbnail, trigger: deleteThumbnail } = useSWRMutation(
    `roms/${rom.id}/thumbnail`,
    (url, { arg }: { arg: string }) => api.delete(`${url}/${encodeURIComponent(arg)}`).json<string>(),
  )

  const isLoading = isUploadingThumbnail || isDeletingThumbnail

  async function handleClickUploadThumbnail() {
    if (isUploadingThumbnail) {
      return
    }
    const file = await fileOpen({ extensions: ['.jpg', '.jpeg', '.png', '.svg'] })
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const thumbnailIds = await uploadThumbnail(formData)
      setThumbnailFileIds(thumbnailIds?.split(',') || [])
    }
  }

  async function handleClickDeleteThumbnail(thumbnailFileId: string) {
    if (isDeletingThumbnail) {
      return
    }
    const thumbnailIds = await deleteThumbnail(thumbnailFileId)
    setThumbnailFileIds(thumbnailIds?.split(',') || [])
  }

  return (
    <div className={clsx('flex flex-wrap items-center gap-2', { 'opacity-60 pointer-events-none': isLoading })}>
      {thumbnailFileIds.map((thumbnailFileId) => (
        <div className='relative size-20 bg-neutral-200' key={thumbnailFileId}>
          <button
            className='absolute right-0 top-0 flex size-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-black text-white'
            disabled={isDeletingThumbnail || isUploadingThumbnail}
            onClick={() => handleClickDeleteThumbnail(thumbnailFileId)}
            title='Delete'
            type='button'
          >
            <span className='icon-[mdi--close]' />
          </button>
          <a className='size-20' href={getFileUrl(thumbnailFileId)} rel='noreferrer noopener' target='_blank'>
            <img alt='Thumbnail' className='size-20 object-contain' src={getFileUrl(thumbnailFileId)} />
          </a>
        </div>
      ))}

      <div className='flex flex-col gap-2'>
        <IconButton
          disabled={isDeletingThumbnail}
          loading={isUploadingThumbnail}
          onClick={handleClickUploadThumbnail}
          title='Upload'
          type='button'
          variant='soft'
        >
          <span className='icon-[mdi--plus]' />
        </IconButton>
      </div>
    </div>
  )
}
