import { createMiddleware } from 'hono/factory'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'

declare module 'hono' {
  interface ContextVariableMap {
    db: ReturnType<typeof createDrizzle>
    storage: ReturnType<typeof createStorage>
    supabase: ReturnType<typeof createSupabase>
  }
}

export function vendors() {
  return createMiddleware(async function middleware(c, next) {
    c.set('db', createDrizzle())
    c.set('storage', createStorage())
    c.set('supabase', createSupabase())
    await next()
  })
}
