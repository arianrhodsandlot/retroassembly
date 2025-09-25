import { Button, type ButtonProps, Dialog } from '@radix-ui/themes'
import { useState } from 'react'
import type { PlatformName } from '@/constants/platform.ts'
import { DialogRoot } from '../../components/dialog-root.tsx'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadButton({
  platform,
  variant = 'soft',
}: Readonly<{ platform: PlatformName; variant?: ButtonProps['variant'] }>) {
  const [key, setKey] = useState(Date.now)
  const [open, setOpen] = useState(false)

  function handleClick() {
    setKey(Date.now)
  }

  return (
    <DialogRoot onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button onClick={handleClick} variant={variant}>
          <span className='icon-[mdi--upload]' />
          Add
        </Button>
      </Dialog.Trigger>
      <UploadDialog key={key} platform={platform} toggleOpen={() => setOpen(false)} />
    </DialogRoot>
  )
}
