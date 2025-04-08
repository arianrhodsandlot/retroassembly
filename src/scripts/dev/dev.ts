import { template } from 'es-toolkit/compat'
import { $, dotenv, fs } from 'zx'

process.env.FORCE_COLOR = '1'

const $$ = $({ verbose: true })

while (true) {
  // prepare wrangler config
  const wranglerTemplate = await fs.readFile('wrangler.template.json', 'utf8')
  const compiled = template(wranglerTemplate)
  const env = { ...process.env, ...dotenv.loadSafe('.env') }
  const wranglerConfig = compiled(env)
  await fs.writeFile('wrangler.json', wranglerConfig, 'utf8')

  try {
    await $$`react-router dev`
  } catch (error) {
    console.warn(error)
  }
}
