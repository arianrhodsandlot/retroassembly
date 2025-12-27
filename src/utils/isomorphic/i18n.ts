import { keyBy, mapValues } from 'es-toolkit'
import i18next, { init } from 'i18next'
import { type LocalCode, locales } from '#@/locales/locales.ts'

export const defaultLanguage = 'en'

const resources = mapValues(
  keyBy(locales, ({ code }) => code),
  ({ translation }) => ({ translation }),
)

init({
  debug: false,
  fallbackLng: defaultLanguage,
  initImmediate: true,
  lng: defaultLanguage,
  resources,
  supportedLngs: locales.map(({ code }) => code),
})

export { i18next as i18n }

const euDateFormat = 'dd/MM/yyyy'
const dotDateFormat = 'dd.MM.yyyy'
const usDateFormat = 'MM/dd/yyyy'
const isoDateFormat = 'yyyy-MM-dd'
const asiaDateFormat = 'yyyy/MM/dd'
export const dateFormats = [asiaDateFormat, dotDateFormat, euDateFormat, isoDateFormat, usDateFormat]

export const dateFormatMap: Record<LocalCode, string> = {
  cs: euDateFormat,
  de: dotDateFormat,
  en: usDateFormat,
  es: euDateFormat,
  fr: euDateFormat,
  it: euDateFormat,
  ja: asiaDateFormat,
  ko: asiaDateFormat,
  pt: euDateFormat,
  ru: dotDateFormat,
  'zh-CN': asiaDateFormat,
  'zh-TW': asiaDateFormat,
}
