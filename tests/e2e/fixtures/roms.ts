 
import path from 'node:path'
import { test as base } from '@playwright/test'
import fs from 'fs-extra'
import ky from 'ky'
import { getCDNUrl } from '../../../src/utils/cdn.ts'

interface Rom {
  path: string
  title: string
  url: string
}

const romsDirectory = 'tests/e2e/fixtures/files/roms/nes'
const titles = ['babelblox', 'flappybird']
const roms = titles.map((title) => {
  const url = getCDNUrl('retrobrews/nes-games', `${title}.nes`)
  const { pathname } = new URL(url)
  const { base } = path.parse(pathname)
  const rom: Rom = { path: path.join(romsDirectory, base), title, url }
  return rom
})

export const test = base.extend<{ roms: Rom[] }>({
  async roms({ page }, use) {
    await fs.ensureDir(romsDirectory)
    await Promise.all(
      roms.map(async (rom) => {
        const exists = await fs.pathExists(rom.path)
        if (!exists) {
          const arrayBuffer = await ky(rom.url).arrayBuffer()
          await fs.writeFile(rom.path, Buffer.from(arrayBuffer))
        }
      }),
    )

    await use(roms)
  },
})
