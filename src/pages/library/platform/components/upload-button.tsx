import { Dialog, IconButton } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useState } from 'react'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadButton({ platform }: { platform: string }) {
  const [key, setKey] = useState(Date.now)
  const [open, toggleOpen] = useToggle()

  function handleClick() {
    setKey(Date.now)
  }

  return (
    <div className='bottom-17 fixed right-8'>
      <Dialog.Root onOpenChange={toggleOpen} open={open}>
        <Dialog.Trigger>
          <IconButton onClick={handleClick} radius='full' size='4' variant='solid'>
            <span className='icon-[mdi--upload] size-5' />
          </IconButton>
        </Dialog.Trigger>
        <UploadDialog key={key} platform={platform} toggleOpen={toggleOpen} />
      </Dialog.Root>
    </div>
  )
}
