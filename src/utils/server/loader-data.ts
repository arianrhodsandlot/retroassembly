import { getRuntimeKey } from 'hono/adapter'
import { getContext } from 'hono/context-storage'
import { getCookie } from 'hono/cookie'
import { getRunTimeEnv } from '@/constants/env.ts'
import { metadata } from '@/constants/metadata.ts'
import { cookieConsentStatusKey } from '@/constants/misc.ts'

export function getLoaderData<T>(data: T = {} as T) {
  const c = getContext()
  const { currentUser, detectedLanguage, language, preference } = c.var
  const cookieConsentStatus = getCookie(c, cookieConsentStatusKey)
  const runTimeEnv = getRunTimeEnv()
  const isLikelyDesktop = c.req.header('sec-ch-ua-mobile') !== '?1'
  const runtimeKey = getRuntimeKey()
  const isOfficialHost = runtimeKey === 'workerd' && new URL(c.req.url).host === metadata.domain

  return {
    cookieConsentStatus,
    currentUser,
    detectedLanguage,
    env: {
      RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE: runTimeEnv.RETROASSEMBLY_RUN_TIME_MAX_UPLOAD_AT_ONCE,
    },
    isLikelyDesktop,
    isOfficialHost,
    language,
    preference,
    runtimeKey,
    ...data,
  }
}
