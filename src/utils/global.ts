import Clarity from '@microsoft/clarity'
import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  const projectId = import.meta.env.VITE_APP_CLARITY_PROJECT_ID
  if (projectId) {
    Clarity.init(import.meta.env.VITE_APP_CLARITY_PROJECT_ID)
    if (globalThis.CURRENT_USER?.id) {
      Clarity.identify(globalThis.CURRENT_USER?.id, undefined, undefined, globalThis.CURRENT_USER?.email)
    }
  }
}
