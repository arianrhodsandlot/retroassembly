import fs from 'fs-extra'

const lockFileContent = await fs.readFile('pnpm-lock.yaml', 'utf8')
const isValidLockFile = lockFileContent.includes('https://codeload.github.com/remix-run/react-router-templates')
if (!isValidLockFile) {
  throw new Error('Invalid pnpm-lock.yaml')
}
