import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  perfectionist: false,
  rules: {
    'import-x/extensions': 'off',
  },
  append: [{ ignores: ['src/core/classes/libretrodb', 'src/views/lib/spatial-navigation/js-spatial-navigation.ts'] }],
})
