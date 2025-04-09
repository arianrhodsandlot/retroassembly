import { template } from 'es-toolkit/compat'
import { $, dotenv, fs } from 'zx'

process.env.FORCE_COLOR = '1'

const $$ = $({ verbose: true })

// prepare wrangler config
const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const env = { ...process.env, ...dotenv.loadSafe('.env') }
const wranglerConfig = compiled(env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

// build
await $$`react-router build`
await $$`esbuild --bundle dist/server/index.js --outfile=dist/server/index.js --platform=node --allow-overwrite --format=esm`
await $$`rm -rf dist/server/assets`
