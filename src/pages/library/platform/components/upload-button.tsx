import { Button, type ButtonProps, Dialog } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PlatformName } from '#@/constants/platform.ts'
import { libraryModeEnum } from '#@/databases/schema.ts'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { DialogRoot } from '../../components/dialog-root.tsx'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadButton({
  platform,
  variant = 'soft',
}: Readonly<{ platform: PlatformName; variant?: ButtonProps['variant'] }>) {
  const { t } = useTranslation()
  const { currentUser } = useGlobalLoaderData()
  const [key, setKey] = useState(Date.now)
  const [open, setOpen] = useState(false)

  if (currentUser?.libraryMode === libraryModeEnum.shared) {
    return null
  }

  function handleClick() {
    setKey(Date.now)
  }

  return (
    <DialogRoot onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>
        <Button onClick={handleClick} variant={variant}>
          <span className='icon-[mdi--upload]' />
          {t('common.add')}
        </Button>
      </Dialog.Trigger>
      <UploadDialog key={key} platform={platform} toggleOpen={() => setOpen(false)} />
    </DialogRoot>
  )
}
