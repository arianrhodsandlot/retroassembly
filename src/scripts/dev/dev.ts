import { $ } from 'zx'

const $$ = $({ verbose: true })

while (true) {
  await $$`rm -rf node_modules/.vite`

  try {
    await $$`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev --experimental-compress`
  } catch (error) {
    console.warn(error)
  }
}
