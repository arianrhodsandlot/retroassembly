import { Button, Dialog, ScrollArea, Tabs } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { EmulatingSettings } from './emulating-settings/emulating-settings.tsx'
import { KeyboardInputs } from './keyboard-inputs.tsx'
import { PlatformCheckboxGroup } from './platform-checkbox-group.tsx'

const settingsTabs = [
  { content: PlatformCheckboxGroup, iconClass: 'icon-[mdi--bookshelf]', name: 'library' },
  { content: KeyboardInputs, iconClass: 'icon-[mdi--controller]', name: 'inputs' },
  { content: EmulatingSettings, iconClass: 'icon-[simple-icons--retroarch]', name: 'Emulating' },
]

export function SettingsDialog(props: Dialog.RootProps) {
  const [tab, setTab] = useState(settingsTabs[0].name)

  return (
    <Dialog.Root {...props}>
      <Dialog.Content aria-describedby={undefined} className='!w-7xl !max-w-screen'>
        <Dialog.Title>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--cog] ' />
            Settings
          </div>
        </Dialog.Title>

        <div className='py-0'>
          <Tabs.Root asChild onValueChange={setTab} value={tab}>
            <div className='h-[60vh]'>
              <Tabs.List>
                {settingsTabs.map(({ iconClass, name }) => (
                  <Tabs.Trigger key={name} value={name}>
                    <span className={clsx('mr-2 size-5', iconClass)} />
                    <span className='text-lg capitalize'>{name}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <ScrollArea size='2'>
                {settingsTabs.map((tab) => (
                  <Tabs.Content asChild key={tab.name} value={tab.name}>
                    <tab.content />
                  </Tabs.Content>
                ))}
              </ScrollArea>
            </div>
          </Tabs.Root>
        </div>

        <div className='flex justify-between'>
          <div className='flex items-center gap-2 text-xs text-[var(--accent-9)]'>
            <span className='icon-[mdi--info]' />
            Your settings will be saved and take effect immediately once changed.
          </div>
        </div>

        <div className='absolute right-6 top-6'>
          <Dialog.Close>
            <Button variant='ghost'>
              <span className='icon-[mdi--close] size-5' />
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
