import { template } from 'es-toolkit/compat'
import { $, fs } from 'zx'

const $$ = $({ verbose: true })

while (true) {
  await $$`rm -rf node_modules/.vite`

  await $$`rm -f waku.config.ts wrangler.json`
  await $$`cp waku.config.dev.ts waku.config.ts`

  const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
  const compiled = template(wranglerTemplate)
  const wranglerConfig = compiled(process.env)
  await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')
  try {
    await $$`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev --experimental-compress`
  } catch (error) {
    console.warn(error)
  }
  await $$`rm -f waku.config.ts wrangler.json`
}
