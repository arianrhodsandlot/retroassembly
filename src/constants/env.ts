import path from 'node:path'

export const dataDirectory = process.env.RETROASSEMBLY_DATA || path.resolve('data', 'node')
export const databasePath = path.join(dataDirectory, 'retroassembly.sqlite')
export const storageDirectory = path.join(dataDirectory, 'storage')
export const romsDirectory = path.join(storageDirectory, 'roms')
export const statesDirectory = path.join(storageDirectory, 'states')
