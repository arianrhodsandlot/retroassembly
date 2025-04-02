import { $ } from 'zx'

const $$ = $({ verbose: true })

// build
await $$`NODE_ENV=production VITE_EXPERIMENTAL_WAKU_ROUTER=true waku build --with-cloudflare`
