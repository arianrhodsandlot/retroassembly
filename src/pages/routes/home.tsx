import { getContext } from 'hono/context-storage'
import { HomePage } from '../page.tsx'
import type { Route } from './+types/home.ts'

export function loader() {
  const { currentUser } = getContext().var
  return { currentUser }
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return <HomePage pageData={loaderData} />
}
