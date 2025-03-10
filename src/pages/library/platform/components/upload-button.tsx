'use client'
import { Dialog } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadButton({ platform }: { platform: string }) {
  const [key, setKey] = useState(Date.now)

  function handleClick() {
    setKey(Date.now)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button
          className={clsx(
            'fixed bottom-12 right-12 flex size-12 items-center justify-center rounded-full bg-rose-700 text-2xl text-white shadow',
          )}
          onClick={handleClick}
          type='button'
        >
          <span className='icon-[mdi--upload]' />
        </button>
      </Dialog.Trigger>
      <UploadDialog key={key} platform={platform} />
    </Dialog.Root>
  )
}
