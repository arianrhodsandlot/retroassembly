import { $ } from 'zx'

const $$ = $({ verbose: true })
while (true) {
  await $$`rm -rf node_modules/.vite`
  await $$`rm -rf waku.config.ts`
  await $$`cp waku.config.dev.ts waku.config.ts`
  try {
    await $$`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev --experimental-compress`
  } catch (error) {
    console.warn(error)
  }
  await $$`rm -rf waku.config.ts`
}
