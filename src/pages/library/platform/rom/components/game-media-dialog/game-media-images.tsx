import { IconButton } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import { clsx } from 'clsx'
import type { InferRequestType } from 'hono'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '@/api/client.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { getFileUrl } from '@/pages/library/utils/file.ts'

const {
  ':thumbnailId{.+}': { $delete },
  $post,
} = client.roms[':id'].thumbnail

export function GameMediaImages() {
  const rom = useRom()
  const [thumbnailFileIds, setThumbnailFileIds] = useState<string[]>(rom.gameThumbnailFileIds?.split(',') || [])

  const param = { id: rom.id }

  const { isMutating: isUploadingThumbnail, trigger: uploadThumbnail } = useSWRMutation(
    { endpoint: 'roms/:id/thumbnail', method: 'post', param },
    ({ param }, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) =>
      parseResponse($post({ form, param })),
  )

  const { isMutating: isDeletingThumbnail, trigger: deleteThumbnail } = useSWRMutation(
    { endpoint: 'roms/:id/thumbnail/:thumbnailId', method: 'delete', param },
    (key, { arg: param }: { arg: InferRequestType<typeof $delete>['param'] }) => parseResponse($delete({ param })),
  )

  const isLoading = isUploadingThumbnail || isDeletingThumbnail

  async function handleClickUploadThumbnail() {
    if (isUploadingThumbnail) {
      return
    }
    const file = await fileOpen({ extensions: ['.jpg', '.jpeg', '.png', '.svg'] })
    if (file) {
      const thumbnailIds = await uploadThumbnail({ file })
      setThumbnailFileIds(thumbnailIds?.split(',') || [])
    }
  }

  async function handleClickDeleteThumbnail(thumbnailId: string) {
    if (isDeletingThumbnail) {
      return
    }
    if (confirm('Are you sure you want to delete this thumbnail?') === false) {
      return
    }
    const thumbnailIds = await deleteThumbnail({ id: rom.id, thumbnailId })
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
            <img alt='Thumbnail' className='size-20 object-contain' loading='lazy' src={getFileUrl(thumbnailFileId)} />
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
