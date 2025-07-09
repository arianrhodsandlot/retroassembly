import { template } from 'es-toolkit/compat'
import { $, argv, dotenv, fs } from 'zx'

process.env.FORCE_COLOR = '1'

const $$ = $({ verbose: true })

await $$`rm -rf node_modules/.vite*`
// prepare wrangler config
const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const env = { ...process.env, ...dotenv.loadSafe('.env') }
const wranglerConfig = compiled(env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

const mode = argv.workerd ? 'workerd' : 'node'
while (true) {
  try {
    await $$`react-router dev --mode=${mode}`
  } catch (error) {
    console.warn(error)
  }
}
