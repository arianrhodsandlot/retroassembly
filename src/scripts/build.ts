import { template } from 'es-toolkit/compat'
import { $, fs } from 'zx'

const $$ = $({ verbose: true })

// reset config files
await $$`rm -rf waku.config.ts`
await $$`cat waku.config.template.ts | grep -v dev-only-line > waku.config.ts`

// prepare wrangler config
const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const wranglerConfig = compiled(process.env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

// build
await $$`NODE_ENV=production VITE_EXPERIMENTAL_WAKU_ROUTER=true waku build --with-cloudflare`

// clean up
await $$`rm -rf waku.config.ts`
