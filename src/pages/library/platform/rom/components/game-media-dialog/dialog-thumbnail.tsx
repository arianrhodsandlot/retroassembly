import { getFileUrl } from '#@/pages/library/utils/file.ts'
import { FileTypeBadge } from '../file-type-badge.tsx'
import { CbzCover } from '../game-media/cbz-thumbnail.tsx'
import { isCbzFile, isImageFile, isPdfFile, isVideoFile } from './utils.ts'

interface DialogThumbnailProps {
  disabled: boolean
  fileId: string
  deleteLabel: string
  onDelete: (fileId: string) => void
}

export function DialogThumbnail({ disabled, fileId, deleteLabel, onDelete }: Readonly<DialogThumbnailProps>) {
  return (
    <div className='group relative size-20 overflow-hidden rounded bg-neutral-200' key={fileId}>
      <button
        aria-label={deleteLabel}
        className='absolute top-0 right-0 z-1 flex items-center justify-center rounded bg-(--accent-9) p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100'
        disabled={disabled}
        onClick={() => onDelete(fileId)}
        title='Delete'
        type='button'
      >
        <span className='icon-[mdi--delete]' />
      </button>
      <DialogThumbnailContent fileId={fileId} />
    </div>
  )
}

function DialogThumbnailContent({ fileId }: { fileId: string }) {
  if (isVideoFile(fileId)) {
    return (
      <div className='relative size-20'>
        <video
          aria-label='Video thumbnail'
          className='size-20 object-cover'
          preload='metadata'
          src={getFileUrl(fileId)}
        >
          <track kind='captions' />
        </video>
        <FileTypeBadge className='absolute right-0 bottom-0 p-0.5 text-lg' type='video' />
      </div>
    )
  }

  if (isCbzFile(fileId)) {
    const url = getFileUrl(fileId)
    return (
      <a className='relative size-20 overflow-hidden' href={url} rel='noreferrer noopener' target='_blank'>
        <CbzCover src={url} />
        <FileTypeBadge className='absolute right-0 bottom-0 p-0.5 text-lg' type='cbz' />
      </a>
    )
  }

  if (isImageFile(fileId)) {
    const url = getFileUrl(fileId)
    return (
      <a className='size-20' href={url} rel='noreferrer noopener' target='_blank'>
        <img alt='Thumbnail' className='size-20 object-contain' loading='lazy' src={url} />
      </a>
    )
  }

  if (isPdfFile(fileId)) {
    const url = getFileUrl(fileId)
    return (
      <a
        aria-label='Open PDF'
        className='flex size-20 items-center justify-center'
        href={url}
        rel='noreferrer noopener'
        target='_blank'
      >
        <span className='icon-[mdi--file-pdf-box] size-8 text-[#a52516]' />
      </a>
    )
  }

  const url = getFileUrl(fileId)
  return (
    <a
      aria-label='Open file'
      className='flex size-20 items-center justify-center'
      href={url}
      rel='noreferrer noopener'
      target='_blank'
    >
      <span className='icon-[mdi--file-document] size-8 text-neutral-500' />
    </a>
  )
}
