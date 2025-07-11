import { createMiddleware } from 'hono/factory'
import { createSupabase } from '@/utils/supabase.ts'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'

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
