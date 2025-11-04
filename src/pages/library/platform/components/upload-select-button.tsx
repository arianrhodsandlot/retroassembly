import { Button, type ButtonProps, DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { DialogRoot } from '../../components/dialog-root.tsx'
import { usePreference } from '../../hooks/use-preference.ts'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadSelectButton({ variant = 'soft' }: Readonly<{ variant?: ButtonProps['variant'] }>) {
  const { t } = useTranslation()
  const { preference } = usePreference()
  const [key, setKey] = useState(Date.now)
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformName>()

  function handleClick(platform: PlatformName) {
    setKey(Date.now)
    setSelectedPlatform(platform)
    setOpen(true)
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant={variant}>
            <span className='icon-[mdi--upload]' />
            {t('Add')}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {preference.ui.platforms.map((platform) => (
            <DropdownMenu.Item
              key={platform}
              onClick={() => {
                handleClick(platform)
              }}
            >
              <img alt={platformMap[platform].displayName} className='size-6' src={getPlatformIcon(platform)} />
              {platformMap[platform].displayName}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DialogRoot onOpenChange={setOpen} open={open}>
        {selectedPlatform ? (
          <UploadDialog key={key} platform={selectedPlatform} toggleOpen={() => setOpen(false)} />
        ) : null}
      </DialogRoot>
    </>
  )
}
