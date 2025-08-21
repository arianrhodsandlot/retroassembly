import { getContext } from 'hono/context-storage'
import { getRunTimeEnv } from '@/constants/env.ts'

export function getLoaderData<T>(data: T) {
  const { preference } = getContext().var
  const runTimeEnv = getRunTimeEnv()

  return {
    ...data,
    env: {
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE,
    },
    preference,
  }
}
