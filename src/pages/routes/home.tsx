import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'
import { HomePage } from '../page.tsx'
import type { Route } from './+types/home.ts'

export function loader() {
  const c = getContext()
  const { currentUser } = c.var
  const skipIfLoggedIn = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_SKIP_HOME_IF_LOGGED_IN === 'true'
  if (currentUser && skipIfLoggedIn) {
    throw c.redirect('/library')
  }
  return { currentUser }
}

export default function HomeRoute({ loaderData }: Readonly<Route.ComponentProps>) {
  return <HomePage pageData={loaderData} />
}
