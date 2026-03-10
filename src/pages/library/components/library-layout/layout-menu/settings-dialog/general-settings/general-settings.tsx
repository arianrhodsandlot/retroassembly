import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { AccessibilitySettings } from './accessibility-settings.tsx'
import { AccountsSettings } from './accounts-settings.tsx'
import { LanguageSettings } from './language-settings.tsx'

export function GeneralSettings() {
  const { runtimeKey } = useGlobalLoaderData()
  return (
    <div className='flex flex-col gap-4'>
      <LanguageSettings />
      <AccessibilitySettings />
      {runtimeKey === 'workerd' ? null : <AccountsSettings />}
    </div>
  )
}
