import { Card, Switch } from '@radix-ui/themes'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

export function SharedLibrarySettings() {
  const { isLoading, preference, update } = usePreference()
  const { env } = useGlobalLoaderData()

  // Only meaningful when a shared library exists; otherwise enabling it would hide uploads and leave
  // an empty library with no way to add ROMs.
  if (env?.RETROASSEMBLY_RUN_TIME_ENABLE_SHARED_ROM_LIBRARY !== 'true') {
    return
  }

  // When the instance forces the mode via env, the per-user toggle is locked on.
  const forced = env?.RETROASSEMBLY_RUN_TIME_SHARED_LIBRARY_ONLY === 'true'

  return (
    <div>
      <SettingsTitle>
        <span className='icon-[mdi--folder-network]' />
        Library mode
      </SettingsTitle>
      <Card>
        <div className='flex flex-col gap-2 py-2'>
          <label className='flex items-center gap-2'>
            <SettingsTitle className='text-base'>
              <span className='icon-[mdi--cloud-off-outline]' />
              Shared library only
            </SettingsTitle>
            <Switch
              checked={preference.ui.sharedLibraryOnly}
              disabled={isLoading || forced}
              onCheckedChange={(checked) => update({ ui: { sharedLibraryOnly: checked } })}
            />
          </label>
          <div className='text-sm text-(--gray-11)'>
            {forced
              ? 'Enabled for this instance by the server administrator. Uploads are disabled entirely.'
              : 'Use only the host-mounted shared ROM library. Upload controls are hidden and uploads are disabled entirely.'}
          </div>
        </div>
      </Card>
    </div>
  )
}
