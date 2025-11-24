import clsx from 'clsx'
import { isBrowser } from 'es-toolkit'
import { Provider } from 'jotai'
import { HydrationBoundary } from 'jotai-ssr'
import { ThemeProvider } from 'next-themes'
import { type ReactNode, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Scripts, ScrollRestoration, useLoaderData } from 'react-router'
import type { loader } from '#@/pages/root.tsx'
import { i18n } from '#@/utils/isomorphic/i18n.ts'
import { preferenceAtom } from '../atoms.ts'
import { CookieConsent } from './cookie-consent.tsx'
import { Head } from './head.tsx'
import { RadixTheme } from './radix-theme.tsx'

if (isBrowser()) {
  i18n.changeLanguage(document.documentElement.lang)
}

export function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { currentUser, isHome, language, preference } = useLoaderData<typeof loader>() || {}
  const hydrateAtom = [preferenceAtom, preference] as const
  const hydrateAtoms = [hydrateAtom]

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language])

  return (
    <html lang={language} prefix='og: https://ogp.me/ns#' suppressHydrationWarning>
      <I18nextProvider i18n={i18n}>
        <Head />
      </I18nextProvider>
      <body className={clsx({ 'bg-(--red-9) 2xl:bg-none': !isHome })}>
        <I18nextProvider i18n={i18n}>
          <RadixTheme>
            <ThemeProvider attribute='class'>
              <Provider>
                <HydrationBoundary hydrateAtoms={hydrateAtoms}>
                  {children}
                  <CookieConsent />
                </HydrationBoundary>
              </Provider>
            </ThemeProvider>
          </RadixTheme>
        </I18nextProvider>
        {currentUser ? (
          <script dangerouslySetInnerHTML={{ __html: `globalThis.CURRENT_USER=${JSON.stringify(currentUser)}` }} />
        ) : null}
        <ScrollRestoration getKey={({ pathname, search }) => `${pathname}${search}`} />
        <Scripts />
      </body>
    </html>
  )
}
