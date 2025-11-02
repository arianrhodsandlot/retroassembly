import { mapValues } from 'es-toolkit'
import i18next from 'i18next'
import { locales } from '@/locales/index.ts'

i18next.init({
  debug: false,
  fallbackLng: 'en',
  initImmediate: true,
  resources: mapValues(locales, (translation) => ({ translation })),
  supportedLngs: Object.keys(locales),
})

export { i18next as i18n }
