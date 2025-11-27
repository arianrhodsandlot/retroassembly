import Clarity from '@microsoft/clarity'
import Cookies from 'js-cookie'
import { cookieConsentStatusKey } from '#@/constants/misc.ts'

let done = false
export function initClarity() {
  if (done) {
    return
  }

  const consent = Cookies.get(cookieConsentStatusKey) !== '0'
  if (consent) {
    const projectId = import.meta.env.RETROASSEMBLY_BUILD_TIME_VITE_CLARITY_PROJECT_ID
    if (projectId) {
      Clarity.init(projectId)
      Clarity.consentV2()
      if (globalThis.CURRENT_USER?.id) {
        Clarity.identify(globalThis.CURRENT_USER?.id, undefined, undefined, globalThis.CURRENT_USER?.email)
      }
      done = true
    }
  }
}
