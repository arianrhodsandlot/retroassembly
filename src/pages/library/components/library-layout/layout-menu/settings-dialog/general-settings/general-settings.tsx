import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'
import { AccountsSettings } from './accounts-settings.tsx'
import { LanguageSettings } from './language-settings.tsx'

export function GeneralSettings() {
  const { runtimeKey } = useGlobalLoaderData()
  return (
    <div className='flex flex-col gap-4'>
      <LanguageSettings />
      {runtimeKey === 'workerd' ? null : <AccountsSettings />}
    </div>
  )
}
