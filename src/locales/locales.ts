import { isEqual } from 'es-toolkit'
import { translation as cs } from './cs.ts'
import { translation as de } from './de.ts'
import { translation as en } from './en.ts'
import { translation as es } from './es.ts'
import { translation as fr } from './fr.ts'
import { translation as it } from './it.ts'
import { translation as ja } from './ja.ts'
import { translation as ko } from './ko.ts'
import { translation as pt } from './pt.ts'
import { translation as ru } from './ru.ts'
import { translation as zhCN } from './zh-cn.ts'
import { translation as zhTW } from './zh-tw.ts'

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

if (import.meta.env?.DEV) {
  for (let i = 1; i < locales.length; i += 1) {
    if (!isEqual(Object.keys(locales[i].translation), Object.keys(locales[i - 1].translation))) {
      throw new Error(`Locale ${locales[i].code} does not have the same keys as locale ${locales[i - 1].code}`)
    }
  }
}
