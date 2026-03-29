import path from 'node:path'
import { test as base } from '@playwright/test'
import fs from 'fs-extra'
import { getCDNUrl } from '../../../src/utils/isomorphic/cdn.ts'

interface Rom {
  path: string
  title: string
  url: string
  platform: string
  displayName: string
}

interface RomDef {
  platform: string
  title: string
  ext: string
  repo: 'nes-games' | 'snes-games' | 'gba-games' | 'gbc-games'
  displayName: string
}

const romDefs: RomDef[] = [
  { displayName: 'NES', ext: 'nes', platform: 'nes', repo: 'nes-games', title: 'babelblox' },
  { displayName: 'NES', ext: 'nes', platform: 'nes', repo: 'nes-games', title: 'flappybird' },
  { displayName: 'Super NES', ext: 'sfc', platform: 'snes', repo: 'snes-games', title: 'hilda' },
  { displayName: 'Super NES', ext: 'sfc', platform: 'snes', repo: 'snes-games', title: 'superbossgaiden' },
  { displayName: 'Game Boy Advance', ext: 'gba', platform: 'gba', repo: 'gba-games', title: 'anguna' },
  { displayName: 'Game Boy Advance', ext: 'gba', platform: 'gba', repo: 'gba-games', title: 'asteroidsb' },
  { displayName: 'Game Boy Color', ext: 'gbc', platform: 'gbc', repo: 'gbc-games', title: 'ucity' },
  { displayName: 'Game Boy Color', ext: 'gbc', platform: 'gbc', repo: 'gbc-games', title: 'brickster' },
]

const roms = romDefs.map((def) => {
  const romsDirectory = `tests/e2e/fixtures/files/roms/${def.platform}`
  const repoName = `retrobrews/${def.repo}` as const
  const url = getCDNUrl(repoName, `${def.title}.${def.ext}`)
  const { pathname } = new URL(url)
  const { base } = path.parse(pathname)
  const rom: Rom = {
    displayName: def.displayName,
    path: path.join(romsDirectory, base),
    platform: def.platform,
    title: def.title,
    url,
  }
  return rom
})

export const test = base.extend<{ roms: Rom[] }>({
  async roms({ page }, use) {
    await Promise.all(
      roms.map(async (rom) => {
        await fs.ensureDir(path.dirname(rom.path))
        const exists = await fs.pathExists(rom.path)
        if (!exists) {
          const response = await fetch(rom.url)
          const arrayBuffer = await response.arrayBuffer()
          await fs.writeFile(rom.path, Buffer.from(arrayBuffer))
        }
      }),
    )

    await use(roms)
  },
})
