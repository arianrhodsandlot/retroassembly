import { getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'

export function getLoaderData<T>(data: T) {
  const { currentUser, preference } = getContext().var
  const runtimeKey = getRuntimeKey()
  const runTimeEnv = getRunTimeEnv()

  return {
    currentUser,
    env: {
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE,
    },
    preference,
    runtimeKey,
    ...data,
  }
}
