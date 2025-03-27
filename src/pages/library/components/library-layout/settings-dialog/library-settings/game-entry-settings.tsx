import { Card, Switch } from '@radix-ui/themes'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function GameEntrySettings() {
  const { preference, update } = usePreference()

  function handleShowTitleChange(checked: boolean) {
    update({ ui: { showTitle: checked } })
  }

  function handleShowDistrictOnTitle(checked: boolean) {
    update({ ui: { showDistrictOnTitle: checked } })
  }

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--order-checkbox-ascending]' />
        Game Display
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--text-long]' />
              Show Game Titles
            </SettingsTitle>
            <Switch checked={preference.ui.showTitle} onCheckedChange={handleShowTitleChange} />
          </label>

          {preference.ui.showTitle ? (
            <label className='flex items-center gap-2'>
              <SettingsTitle className='text-base'>
                <span className='icon-[mdi--earth]' />
                Show District on Game Titles
              </SettingsTitle>
              <Switch checked={preference.ui.showDistrictOnTitle} onCheckedChange={handleShowDistrictOnTitle} />
            </label>
          ) : null}
        </div>
      </Card>
    </div>
  )
}
