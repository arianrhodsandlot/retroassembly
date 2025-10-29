import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'
import { metadata } from '@/constants/metadata.ts'
import { getLoaderData } from '@/utils/server/loader-data.ts'
import { HomePage } from '../page.tsx'

export function loader() {
  const loaderData = getLoaderData({ title: metadata.title })

  const skipIfLoggedIn = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN === 'true'
  if (loaderData.currentUser && skipIfLoggedIn) {
    const c = getContext()
    throw c.redirect('/library')
  }

  return loaderData
}

export default function HomeRoute() {
  return <HomePage />
}
