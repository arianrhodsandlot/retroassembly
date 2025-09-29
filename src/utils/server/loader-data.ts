import { getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'

export function getLoaderData<T>(data: T) {
  const c = getContext()
  const { currentUser, preference } = c.var
  const runtimeKey = getRuntimeKey()
  const runTimeEnv = getRunTimeEnv()
  const isLikelyDesktop = c.req.header('sec-ch-ua-mobile') !== '?1'

  return {
    currentUser,
    env: {
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE,
    },
    isLikelyDesktop,
    preference,
    runtimeKey,
    ...data,
  }
}
