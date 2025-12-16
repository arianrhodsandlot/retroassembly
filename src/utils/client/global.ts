import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  try {
    if (import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_DISABLE_FS_ACCESS_API === 'true') {
      delete globalThis.showOpenFilePicker
    }
  } catch {}
}
