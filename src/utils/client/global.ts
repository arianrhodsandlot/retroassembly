import { isBrowser } from 'es-toolkit'

if (isBrowser()) {
  try {
    if (navigator.webdriver) {
      delete globalThis.showOpenFilePicker
    }
  } catch {}
}
