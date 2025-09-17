import { Button, type ButtonProps, DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { DialogRoot } from '../../components/dialog-root.tsx'
import { usePreference } from '../../hooks/use-preference.ts'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadSelectButton({ variant = 'soft' }: Readonly<{ variant?: ButtonProps['variant'] }>) {
  const { preference } = usePreference()
  const [key, setKey] = useState(Date.now)
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('')

  function handleClick(platform: string) {
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
            Add
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
