import Clarrity from '@microsoft/clarity'
import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  const projectId = import.meta.env.VITE_APP_CLARRITY_PROJECT_ID
  if (projectId) {
    Clarrity.init(import.meta.env.VITE_APP_CLARRITY_PROJECT_ID)
  }
}
