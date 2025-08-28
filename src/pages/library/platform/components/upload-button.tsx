import { Button, type ButtonProps, Dialog } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useState } from 'react'
import { DialogRoot } from '../../components/dialog-root.tsx'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadButton({
  platform,
  variant = 'soft',
}: Readonly<{ platform: string; variant?: ButtonProps['variant'] }>) {
  const [key, setKey] = useState(Date.now)
  const [open, toggleOpen] = useToggle()

  function handleClick() {
    setKey(Date.now)
  }

  return (
    <DialogRoot onOpenChange={toggleOpen} open={open}>
      <Dialog.Trigger>
        <Button onClick={handleClick} variant={variant}>
          <span className='icon-[mdi--upload]' />
          Add
        </Button>
      </Dialog.Trigger>
      <UploadDialog key={key} platform={platform} toggleOpen={toggleOpen} />
    </DialogRoot>
  )
}
