import { Card, Switch } from '@radix-ui/themes'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function LayoutSettings() {
  const { isLoading, preference, update } = usePreference()

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--order-checkbox-ascending]' />
        Layout
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--page-layout-sidebar-left]' />
              Show Sidebar
            </SettingsTitle>
            <Switch
              checked={preference.ui.showSidebar}
              disabled={isLoading}
              onCheckedChange={(checked) => update({ ui: { showSidebar: checked } })}
            />
          </label>
        </div>
      </Card>
    </div>
  )
}
