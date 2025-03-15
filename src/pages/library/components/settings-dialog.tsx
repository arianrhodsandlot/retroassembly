import { Button, Dialog, ScrollArea, Tabs } from '@radix-ui/themes'
import { EmulatingSettings } from './emulating-settings.tsx'
import { KeyboardInputs } from './keyboard-inputs.tsx'
import { PlatformCheckbox } from './platform-checkbox.tsx'

export function SettingsDialog(props: Dialog.RootProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Content aria-describedby={undefined} className='!w-7xl !max-w-screen'>
        <Dialog.Title>
          <div className='flex items-center gap-2'>
            <span className='icon-[mdi--cog] ' />
            Settings
          </div>
        </Dialog.Title>

        <div className='py-4'>
          <Tabs.Root defaultValue='account'>
            <Tabs.List>
              <Tabs.Trigger value='library'>
                <span className='icon-[mdi--library-shelves] mr-2 size-5' />
                <span className='text-lg'>Library</span>
              </Tabs.Trigger>
              <Tabs.Trigger value='inputs'>
                <span className='icon-[mdi--controller] mr-2 size-5' />
                <span className='text-lg'>Inputs</span>
              </Tabs.Trigger>
              <Tabs.Trigger value='emulating'>
                <span className='icon-[simple-icons--retroarch] mr-2 size-5' />
                <span className='text-lg'>Emulating</span>
              </Tabs.Trigger>
            </Tabs.List>

            <div className='h-[60vh]'>
              <ScrollArea>
                <Tabs.Content value='library'>
                  <label>
                    <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
                      <span className='icon-[mdi--order-checkbox-ascending]' />
                      Enabled Platforms
                    </h3>
                    <PlatformCheckbox />
                  </label>
                </Tabs.Content>

                <Tabs.Content value='inputs'>
                  <h3 className='flex items-center gap-2 py-2 text-lg font-semibold'>
                    <span className='icon-[mdi--keyboard]' /> Keyboard Inputs
                  </h3>
                  <KeyboardInputs />
                </Tabs.Content>

                <Tabs.Content value='emulating'>
                  <EmulatingSettings />
                </Tabs.Content>
              </ScrollArea>
            </div>
          </Tabs.Root>
        </div>

        <div className='flex justify-between'>
          <div className='flex items-center gap-2 text-sm text-[var(--accent-9)]'>
            <span className='icon-[mdi--info]' />
            Your settings will be saved automatically once changed.
          </div>
          <Dialog.Close>
            <Button variant='soft'>
              <span className='icon-[mdi--check]' />
              Done
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
