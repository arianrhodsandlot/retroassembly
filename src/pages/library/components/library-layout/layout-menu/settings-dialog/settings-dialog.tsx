import { Button, Dialog, ScrollArea, Tabs } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { dropRight } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'
import { useSettingsDialogTabName } from '@/pages/library/atoms.ts'
import { DialogRoot } from '../../../dialog-root.tsx'
import { AccountSettings } from './account-settings.tsx'
import { EmulatingSettings } from './emulating-settings/emulating-settings.tsx'
import { InputsSettings } from './inputs-settings/inputs-setting.tsx'
import { LibrarySettings } from './library-settings/library-settings.tsx'

const allSettingsTabs = [
  { content: LibrarySettings, iconClass: 'icon-[mdi--bookshelf]', name: 'library' },
  { content: InputsSettings, iconClass: 'icon-[mdi--controller]', name: 'inputs' },
  { content: EmulatingSettings, iconClass: 'icon-[simple-icons--retroarch]', name: 'emulating' },
  { content: AccountSettings, iconClass: 'icon-[mdi--account]', name: 'account' },
]

export function SettingsDialog({ onOpenChange, ...props }: Readonly<Dialog.RootProps>) {
  const { t } = useTranslation()
  const [tabName, setTabName] = useSettingsDialogTabName()
  const { content: TabContent } = allSettingsTabs.find((tab) => tab.name === tabName) || allSettingsTabs[0]
  const { runtimeKey } = useLoaderData()
  const settingsTabs = runtimeKey === 'workerd' ? dropRight(allSettingsTabs, 1) : allSettingsTabs

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
          <span className='icon-[mdi--cog] ' />
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
          <div className='text-(--accent-9) flex items-center gap-2 text-xs'>
            <span className='icon-[mdi--info]' />
            {t('Your settings will be saved and take effect immediately once changed.')}
          </div>
        </div>

        <div className='absolute right-6 top-6'>
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
