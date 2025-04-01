import { GameEntrySettings } from './game-entry-settings.tsx'
import { LayoutSettings } from './layout-settings.tsx'
import { PlatformSettings } from './platform-settings.tsx'

export function LibrarySettings() {
  return (
    <>
      <PlatformSettings />
      <LayoutSettings />
      <GameEntrySettings />
    </>
  )
}
