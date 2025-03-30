import { $ } from 'zx'

const $$ = $({ verbose: true })

await $$`rm -rf waku.config.ts`
await $$`cp waku.config.build.ts waku.config.ts`
await $$`NODE_ENV=production VITE_EXPERIMENTAL_WAKU_ROUTER=true waku build --with-cloudflare`
await $$`rm -rf waku.config.ts`
