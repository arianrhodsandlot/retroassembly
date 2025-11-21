import { getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getCookie } from 'hono/cookie'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { cookieConsentStatusKey } from '#@/constants/misc.ts'

export function getLoaderData<T>(data: T = {} as T) {
  const c = getContext()
  const { currentUser, detectedLanguage, language, preference } = c.var
  const cookieConsentStatus = getCookie(c, cookieConsentStatusKey)
  const runTimeEnv = getRunTimeEnv()
  const env = {
    RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_ROM_COUNT,
    RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE,
  }
  const isLikelyDesktop = c.req.header('sec-ch-ua-mobile') !== '?1'
  const runtimeKey = getRuntimeKey()
  const { host } = new URL(c.req.url)
  const isOfficialHost = host === 'retroassembly.com' || host.endsWith('-retroassembly.arianrhodsandlot.workers.dev')

  return {
    cookieConsentStatus,
    currentUser,
    detectedLanguage,
    env,
    isLikelyDesktop,
    isOfficialHost,
    language,
    preference,
    runtimeKey,
    title: '',
    ...data,
  }
}
