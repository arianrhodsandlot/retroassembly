import { usePreference } from './use-preference.ts'

/** Whether uploads are disabled for the current user (shared library only mode). */
export function useUploadsDisabled() {
  const { preference } = usePreference()
  return preference.ui.sharedLibraryOnly
}
