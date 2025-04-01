import { template } from 'es-toolkit/compat'
import { $, fs } from 'zx'

const $$ = $({ verbose: true })

await $$`rm -rf waku.config.ts`
await $$`cp waku.config.build.ts waku.config.ts`
await $$`NODE_ENV=production VITE_EXPERIMENTAL_WAKU_ROUTER=true waku build --with-cloudflare`
await $$`rm -rf waku.config.ts`

const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
const compiled = template(wranglerTemplate)
const wranglerConfig = compiled(process.env)
await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
