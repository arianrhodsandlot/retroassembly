import { $ } from 'zx'

while (true) {
  await $`rm -rf node_modules/.vite/waku-dev-server-*`
  try {
    await $({ verbose: true })`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev --experimental-compress`
  } catch (error) {
    console.warn(error)
  }
}
