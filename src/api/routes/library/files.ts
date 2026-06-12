import { attemptAsync } from 'es-toolkit'
import { Hono } from 'hono'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { getFileContent } from '#@/utils/server/misc.ts'
import { isSharedRomFileId } from '#@/utils/server/shared-rom.ts'
import { createFileResponse } from '../utils.ts'

export const files = new Hono().get(':id{.+}', async (c) => {
  const id = c.req.param('id')
  const runTimeEnv = getRunTimeEnv()
  // Shared ROM files live on the local mount, never on the external storage host.
  if (runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST && !isSharedRomFileId(id)) {
    return c.redirect(new URL(id, runTimeEnv.RETROASSEMBLY_RUN_TIME_STORAGE_HOST))
  }
  // A malformed/traversal shared id makes resolveSharedRomPath throw; treat as not found, not a 500.
  const [, file] = await attemptAsync(() => getFileContent(id))
  if (file) {
    return createFileResponse(file)
  }
})
