import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  append: {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname, // 👈
      }
    }
  }
})
