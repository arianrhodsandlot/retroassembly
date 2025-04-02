import { template } from 'es-toolkit/compat'
import { $, dotenv, fs } from 'zx'

const $$ = $({ verbose: true })

while (true) {
  await $$`rm -rf node_modules/.vite`

  // prepare wrangler config
  const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
  const compiled = template(wranglerTemplate)
  const env = { ...process.env, ...dotenv.loadSafe('.env') }
  const wranglerConfig = compiled(env)
  await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

  try {
    await $$`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev --experimental-compress`
  } catch (error) {
    console.warn(error)
  }
}
