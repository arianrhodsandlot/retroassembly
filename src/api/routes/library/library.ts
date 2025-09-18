import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { files } from './files.ts'
import { launchRecords } from './launch-records.ts'
import { preference } from './preference.ts'
import { roms } from './roms.ts'
import { states } from './states.ts'

const authMiddleware = createMiddleware(async (c, next) => {
  const { unauthorized } = c.var
  if (unauthorized) {
    return c.json({ message: 'Unauthorized' }, 400)
  }
  return await next()
})

export const app = new Hono()
  .use(authMiddleware)
  .route('files', files)
  .route('launch_records', launchRecords)
  .route('preference', preference)
  .route('roms', roms)
  .route('states', states)
