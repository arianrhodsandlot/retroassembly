import { Button, Dialog, DropdownMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useState } from 'react'
import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/library.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { UploadDialog } from './upload-dialog.tsx'

export function UploadSelectButton() {
  const { preference } = usePreference()
  const [key, setKey] = useState(Date.now)
  const [open, toggleOpen] = useToggle()
  const [selectedPlatform, setSelectedPlatform] = useState('')

  function handleClick(platform: string) {
    setKey(Date.now)
    setSelectedPlatform(platform)
    toggleOpen()
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant='soft'>
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

      <Dialog.Root onOpenChange={toggleOpen} open={open}>
        {selectedPlatform ? <UploadDialog key={key} platform={selectedPlatform} toggleOpen={toggleOpen} /> : null}
      </Dialog.Root>
    </>
  )
}
