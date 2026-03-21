import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { test as base } from '@playwright/test'
import { getCDNUrl } from '../../../src/utils/isomorphic/cdn.ts'

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
    await mkdir(romsDirectory, { recursive: true })
    await Promise.all(
      roms.map(async (rom) => {
        try {
          await access(rom.path)
        } catch {
          const response = await fetch(rom.url)
          const arrayBuffer = await response.arrayBuffer()
          await writeFile(rom.path, Buffer.from(arrayBuffer))
        }
      }),
    )

    await use(roms)
  },
})
