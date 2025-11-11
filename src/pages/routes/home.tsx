import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'
import { metadata } from '@/constants/metadata.ts'
import { locales } from '@/locales/locales.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { HomePage } from '../page.tsx'
import type { Route } from './+types/home.ts'

export function loader({ params }: Route.LoaderArgs) {
  const loaderData = getLoaderData({ title: metadata.title })
  const c = getContext()

  if (params.language && !locales.some(({ code }) => params.language === code.toLowerCase())) {
    throw new Response('Not Found', { status: 404 })
  }

  const skipIfLoggedIn = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN === 'true1'
  if (loaderData.currentUser && skipIfLoggedIn) {
    throw c.redirect('/library')
  }

  return loaderData
}

export default function HomeRoute() {
  return <HomePage />
}
