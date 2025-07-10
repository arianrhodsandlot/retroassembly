import { template } from 'es-toolkit/compat'
import { $, argv, dotenv, fs } from 'zx'

process.env.FORCE_COLOR = '1'

const $$ = $({ verbose: true })

// prepare wrangler config
const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const env = { ...process.env, ...dotenv.loadSafe('.env') }
const wranglerConfig = compiled(env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

// build
let mode = argv.mode || argv.m || process.env.WORKERS_CI === '1' ? 'workerd' : 'node'
mode = ['w', 'workerd'].includes(mode) ? 'workerd' : 'node'
await $$`react-router build --mode=${mode}`
