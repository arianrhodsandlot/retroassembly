import { GameEntrySettings } from './game-entry-settings.tsx'
import { PlatformSettings } from './platform-settings.tsx'

export function LibrarySettings() {
  return (
    <>
      <PlatformSettings />
      <GameEntrySettings />
    </>
  )
}
