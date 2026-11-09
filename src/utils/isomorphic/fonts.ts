import { cdnHost, toCDNCacheUrl } from './cdn.ts'

const unicodeRange = [
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC',
  'U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
].join(', ')

export const fonts = [
  { family: 'Inter Variable', path: 'fontsource/fonts/inter:vf@5.2.8/latin-wght-normal.woff2', weight: '100 900' },
  {
    family: 'Roboto Slab Variable',
    path: 'fontsource/fonts/roboto-slab:vf@5.2.8/latin-wght-normal.woff2',
    weight: '100 900',
  },
  {
    family: 'Ubuntu Sans Mono Variable',
    path: 'fontsource/fonts/ubuntu-sans-mono:vf@latest/latin-wght-normal.woff2',
    weight: '400 700',
  },
]

export function getFontUrl(path: string) {
  return new URL(path, cdnHost).href
}

export function getFontFaces() {
  return fonts
    .map(
      ({ family, path, weight }) =>
        `@font-face{font-family:'${family}';font-style:normal;font-display:swap;font-weight:${weight};src:url(${toCDNCacheUrl(getFontUrl(path))}) format('woff2-variations');unicode-range:${unicodeRange}}`,
    )
    .join('\n')
}
