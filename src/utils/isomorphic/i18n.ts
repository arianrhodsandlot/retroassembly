import { keyBy, mapValues } from 'es-toolkit'
import i18next from 'i18next'
import { locales } from '@/locales/index.ts'

export const defaultLanguage = 'en'

const resources = mapValues(
  keyBy(locales, ({ code }) => code),
  ({ translation }) => ({ translation }),
)

i18next.init({
  debug: false,
  fallbackLng: defaultLanguage,
  initImmediate: true,
  lng: defaultLanguage,
  resources,
  supportedLngs: locales.map(({ code }) => code),
})

export { i18next as i18n }
