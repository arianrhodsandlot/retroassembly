import { Hono } from 'hono'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { getFileContent } from '#@/utils/server/misc.ts'
import { createFileResponse } from '../utils.ts'

export const files = new Hono().get(':id{.+}', async (c) => {
  const id = c.req.param('id')
  const runTimeEnv = getRunTimeEnv()
  if (runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST) {
    return c.redirect(new URL(id, runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST))
  }
  const file = await getFileContent(id)
  if (file) {
    return createFileResponse(file)
  }
})
