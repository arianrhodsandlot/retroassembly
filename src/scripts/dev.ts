import path from 'node:path'
import fs from 'fs-extra'
import { exec, getMode, prepareWranglerConfig } from './utils.ts'

const viteCacheNames = ['.vite', '.vite-child-compiler', '.vite-temp']
await Promise.all(viteCacheNames.map((name) => fs.remove(path.join('node_modules', name))))

await prepareWranglerConfig()

while (true) {
  try {
    await exec`react-router --mode=${getMode()}`
  } catch {}
}
