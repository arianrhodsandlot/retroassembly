import { $ } from 'zx'

while (true) {
  await $`rm -rf node_modules/.vite/waku-dev-server-*`
  try {
    await $({ verbose: true })`VITE_EXPERIMENTAL_WAKU_ROUTER=true waku dev`
  } catch (error) {
    console.warn(error)
  }
}
