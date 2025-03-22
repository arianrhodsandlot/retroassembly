import { Button, Dialog, ScrollArea, Tabs } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { clsx } from 'clsx'
import { useState, useTransition } from 'react'
import { EmulatingSettings } from './emulating-settings/emulating-settings.tsx'
import { InputsSettings } from './inputs-settings/inputs-setting.tsx'
import { LibrarySettings } from './library-settings/library-settings.tsx'

const settingsTabs = [
  { content: LibrarySettings, iconClass: 'icon-[mdi--bookshelf]', name: 'library' },
  { content: InputsSettings, iconClass: 'icon-[mdi--controller]', name: 'inputs' },
  { content: EmulatingSettings, iconClass: 'icon-[simple-icons--retroarch]', name: 'Emulating' },
]

export function SettingsDialog({ onOpenChange, ...props }: Dialog.RootProps) {
  const [tab, setTab] = useState(settingsTabs[0])
  const [TabContent, setTabContent] = useState(() => settingsTabs[0].content)
  const [enableTabAnimation, toggleTabAnimation] = useToggle()
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(open) {
    toggleTabAnimation(open)
    onOpenChange?.(open)
  }

  function handleValueChange(tabName: string) {
    toggleTabAnimation(true)
    const clickedTab = settingsTabs.find((tab) => tabName === tab.name)
    if (clickedTab) {
      setTab(clickedTab)
      startTransition(() => {
        setTabContent(() => clickedTab.content)
      })
    }
  }

  return (
    <Dialog.Root {...props} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined} className='!w-7xl !max-w-screen'>
        <Dialog.Title>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--cog] ' />
            Settings
          </div>
        </Dialog.Title>

        <div className='py-0'>
          <Tabs.Root asChild onValueChange={handleValueChange} value={tab.name}>
            <div>
              <Tabs.List>
                {settingsTabs.map(({ iconClass, name }) => (
                  <Tabs.Trigger key={name} value={name}>
                    <span className={clsx('mr-2 size-5', iconClass)} />
                    <span className='text-lg capitalize'>{name}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <div className='h-[60vh]'>
                <ScrollArea size='2'>
                  {isPending ? null : (
                    <div className={clsx('p-4', { 'motion-preset-slide-up-sm': enableTabAnimation })} key={tab.name}>
                      <TabContent />
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </Tabs.Root>
        </div>

        <div className='mt-4 flex justify-between'>
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
