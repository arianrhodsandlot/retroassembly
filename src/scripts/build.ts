import { exec, getMode, prepareWranglerConfig } from './utils.ts'

prepareWranglerConfig()
await exec`react-router build --mode=${getMode()}`
