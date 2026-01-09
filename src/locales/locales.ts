import { isEqual } from 'es-toolkit'
import cs from './cs.json'
import de from './de.json'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import it from './it.json'
import ja from './ja.json'
import ko from './ko.json'
import pt from './pt.json'
import ru from './ru.json'
import zhCN from './zh-CN.json'
import zhTW from './zh-TW.json'

export const localeCodes = ['cs', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh-CN', 'zh-TW'] as const

export type LocalCode = (typeof localeCodes)[number]

export const locales = [
  { code: 'cs', name: 'Čeština', translation: cs },
  { code: 'de', name: 'Deutsch', translation: de },
  { code: 'en', name: 'English', translation: en },
  { code: 'es', name: 'Español', translation: es },
  { code: 'fr', name: 'Français', translation: fr },
  { code: 'it', name: 'Italiano', translation: it },
  { code: 'ja', name: '日本語', translation: ja },
  { code: 'ko', name: '한국어', translation: ko },
  { code: 'pt', name: 'Português', translation: pt },
  { code: 'ru', name: 'Русский', translation: ru },
  { code: 'zh-CN', name: '简体中文', translation: zhCN },
  { code: 'zh-TW', name: '繁體中文', translation: zhTW },
]

if (import.meta.env?.DEV || import.meta.main) {
  for (let i = 1; i < locales.length; i += 1) {
    if (!isEqual(Object.keys(locales[i].translation), Object.keys(locales[i - 1].translation))) {
      throw new Error(`Locale ${locales[i].code} does not have the same keys as locale ${locales[i - 1].code}`)
    }
  }
}
