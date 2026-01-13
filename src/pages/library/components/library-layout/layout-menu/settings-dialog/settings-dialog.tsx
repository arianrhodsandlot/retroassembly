import { Button, Dialog, ScrollArea, Tabs } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSettingsDialogTabName } from '#@/pages/library/atoms.ts'
import { DialogRoot } from '../../../dialog-root.tsx'
import { EmulatingSettings } from './emulating-settings/emulating-settings.tsx'
import { GeneralSettings } from './general-settings/general-settings.tsx'
import { InputsSettings } from './inputs-settings/inputs-setting.tsx'
import { LibrarySettings } from './library-settings/library-settings.tsx'

const settingsTabs = [
  { content: LibrarySettings, iconClass: 'icon-[mdi--bookshelf]', name: 'library' },
  { content: InputsSettings, iconClass: 'icon-[mdi--controller]', name: 'inputs' },
  { content: EmulatingSettings, iconClass: 'icon-[simple-icons--retroarch]', name: 'emulating' },
  { content: GeneralSettings, iconClass: 'icon-[mdi--cog]', name: 'general' },
]

export function SettingsDialog({ onOpenChange, ...props }: Readonly<Dialog.RootProps>) {
  const { t } = useTranslation()
  const [tabName, setTabName] = useSettingsDialogTabName()
  const { content: TabContent } = settingsTabs.find((tab) => tab.name === tabName) || settingsTabs[0]

  function handleOpenChange(open: boolean) {
    onOpenChange?.(open)
  }

  function handleValueChange(tabName: string) {
    setTabName(tabName)
  }

  return (
    <DialogRoot {...props} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined} className='lg:w-5xl!' maxWidth='calc(100vw - var(--space-8))'>
        <Dialog.Title className='flex items-center gap-2'>
          <span className='icon-[mdi--cog]' />
          {t('Settings')}
        </Dialog.Title>

        <div>
          <Tabs.Root asChild onValueChange={handleValueChange} value={tabName}>
            <div>
              <Tabs.List>
                {settingsTabs.map(({ iconClass, name }) => (
                  <Tabs.Trigger key={name} value={name}>
                    <span className={clsx('mr-2 size-5', iconClass)} />
                    <span className='text-lg capitalize'>{t(name)}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <div className='h-[60vh]'>
                <ScrollArea size='2'>
                  <div className='motion-preset-slide-up-sm p-4' key={tabName}>
                    <TabContent />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </Tabs.Root>
        </div>

        <div className='mt-4 flex justify-between'>
          <div className='flex items-center gap-2 text-xs text-(--accent-9)'>
            <span className='icon-[mdi--info]' />
            {t('Your settings will be saved and take effect immediately once changed.')}
          </div>
        </div>

        <div className='absolute top-6 right-6'>
          <Dialog.Close>
            <Button title={t('Close')} variant='ghost'>
              <span className='icon-[mdi--close] size-5' />
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </DialogRoot>
  )
}
