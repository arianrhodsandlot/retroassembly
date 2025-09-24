import { type CookieOptions, createServerClient, parseCookieHeader } from '@supabase/ssr'
import { env } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { setCookie } from 'hono/cookie'

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
  const { RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY, RETROASSEMBLY_RUN_TIME_SUPABASE_URL } = env<{
    RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: string
    RETROASSEMBLY_RUN_TIME_SUPABASE_URL: string
  }>(c)
  if (RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY && RETROASSEMBLY_RUN_TIME_SUPABASE_URL) {
    return createServerClient(RETROASSEMBLY_RUN_TIME_SUPABASE_URL, RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          const cookieHeader = c.req.header('Cookie') ?? ''
          const cookies = parseCookieHeader(cookieHeader) as { name: string; value: string }[]
          return cookies
        },

        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            setCookie(c, cookie.name, cookie.value, cookie.options as any)
          }
        },
      },
    })
  }
}
