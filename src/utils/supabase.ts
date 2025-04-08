import { type CookieOptions, createServerClient, parseCookieHeader } from '@supabase/ssr'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'

declare module 'hono' {
  interface ContextVariableMap {
    cookiesToSet: {
      name: string
      options: CookieOptions
      value: string
    }[]
  }
}

export function createSupabase() {
  const c = getContext()
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env<{ SUPABASE_ANON_KEY: string; SUPABASE_URL: string }>(c)

  if (!SUPABASE_ANON_KEY || !SUPABASE_URL) {
    console.warn('SUPABASE_ANON_KEY and SUPABASE_URL is not found in the environment. Not creating the supabase client')
    return
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookieHeader = c.req.header('Cookie') ?? ''
        return parseCookieHeader(cookieHeader) as { name: string; value: string }[]
      },

      setAll(cookiesToSet) {
        c.set('cookiesToSet', cookiesToSet)
      },
    },
  })
}
