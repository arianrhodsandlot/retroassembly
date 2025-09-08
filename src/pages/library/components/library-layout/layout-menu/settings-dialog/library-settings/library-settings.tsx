import { GameEntrySettings } from './game-entry-settings.tsx'
import { PlatformSettings } from './platform-settings.tsx'

export function LibrarySettings() {
  return (
    <div className='flex flex-col gap-8'>
      <PlatformSettings />
      <GameEntrySettings />
    </div>
  )
}
