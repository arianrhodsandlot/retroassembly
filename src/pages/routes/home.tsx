import { getContext } from 'hono/context-storage'
import { getCookie } from 'hono/cookie'
import { getRunTimeEnv } from '@/constants/env.ts'
import { metadata } from '@/constants/metadata.ts'
import { locales } from '@/locales/locales.ts'
import { defaultLanguage } from '@/utils/isomorphic/i18n.ts'
import { getHomePath } from '@/utils/isomorphic/misc.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { HomePage } from '../home/page.tsx'
import type { Route } from './+types/home.ts'

function isValidLanguage(language?: string): language is string {
  return locales.some(({ code }) => language?.toLowerCase() === code.toLowerCase())
}

export function loader({ params }: Route.LoaderArgs) {
  const loaderData = getLoaderData({ title: metadata.title })
  const { detectedLanguage, language } = loaderData
  const c = getContext()

  const skipIfLoggedIn = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN === 'true'
  if (loaderData.currentUser && skipIfLoggedIn) {
    throw c.redirect('/library')
  }

  const isDetectedLanguage = language === detectedLanguage

  if (!params.language) {
    const homeLanguage = getCookie(c, 'home-language')
    if (isValidLanguage(homeLanguage)) {
      if (homeLanguage !== defaultLanguage) {
        throw c.redirect(getHomePath(homeLanguage))
      }
    } else if (!isDetectedLanguage) {
      throw c.redirect(getHomePath(detectedLanguage))
    }
  } else if (params.language === defaultLanguage || !isValidLanguage(params.language)) {
    throw new Response('Not Found', { status: 404 })
  }

  return loaderData
}

export default function HomeRoute() {
  return <HomePage />
}
