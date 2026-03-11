export const metadata = {
  buildDate: import.meta.env?.RETROASSEMBLY_BUILD_TIME_VITE_BUILD_TIME,
  description: 'The personal retro game collection cabinet in your browser',
  link: 'https://retroassembly.com/',
  themeColor: import.meta.env?.RETROASSEMBLY_BUILD_TIME_VITE_THEME_COLOR || '#be123c',
  title: 'RetroAssembly',
  version: import.meta.env?.RETROASSEMBLY_BUILD_TIME_VITE_VERSION,
}
