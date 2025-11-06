import { useLoaderData } from 'react-router'
import { AccountSettings } from './account-settings.tsx'
import { LanguageSettings } from './language-settings.tsx'

export function GeneralSettings() {
  const { runtimeKey } = useLoaderData()
  return (
    <div className='flex flex-col gap-4'>
      <LanguageSettings />
      {runtimeKey === 'workerd' ? null : <AccountSettings />}
    </div>
  )
}
