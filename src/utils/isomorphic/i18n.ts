import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { locales } from '@/locales/index.ts'

export const fallbackLng = 'en'
export const languages = [...new Set(['en', fallbackLng, 'zh'])]
export const defaultNS = 'translation'

async function initI18next(lng: string, ns: string) {
  const i18nInstance = createInstance()
  await i18nInstance.use(initReactI18next).use(resourcesToBackend(locales)).init({
    debug: false,
    defaultNS,
    fallbackLng,
    fallbackNS: defaultNS,
    lng,
    ns,
    supportedLngs: languages,
  })
  return i18nInstance
}

export async function getTranslation(
  lng: string = fallbackLng,
  ns: string = defaultNS,
  options: { keyPrefix?: string } = {},
) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    i18n: i18nextInstance,
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
  }
}
