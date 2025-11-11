import { noop } from 'es-toolkit'
import { createElement, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { Links, Meta, useLoaderData } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import type { loader } from '@/pages/root.tsx'
import { cdnHost } from '@/utils/isomorphic/cdn.ts'

export function Head() {
  const { t } = useTranslation()
  const { headElements } = useLoaderData<typeof loader>() || {}
  const target = useSyncExternalStore(
    () => noop,
    () => (globalThis.self === globalThis.top ? '_self' : '_blank'),
    () => '_self',
  )

  return (
    <head>
      <meta charSet='utf-8' />
      <meta content='width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=yes' name='viewport' />
      <meta content={metadata.themeColor} name='theme-color' />
      <meta content='telephone=no' name='format-detection' />
      <meta content={metadata.title} name='apple-mobile-web-app-title' />
      <meta content='black-translucent' name='apple-mobile-web-app-status-bar-style' />
      <meta content='yes' name='mobile-web-app-capable' />

      <base target={target} />

      {/* metadata related */}
      <meta content={t(metadata.description)} name='description' />
      <link href={metadata.link} rel='canonical' />

      <link href='/assets/logo/logo-192x192.png' rel='icon' sizes='any' />
      <link href='/assets/logo/logo.svg' rel='icon' type='image/svg+xml' />
      <link href='/assets/logo/apple-touch-icon.png' rel='apple-touch-icon' sizes='any' />

      <link href='/manifest.webmanifest' rel='manifest' />

      <meta content='website' property='og:type' />
      <meta content={metadata.link} property='og:url' />
      <meta content={metadata.title} property='og:title' />
      <meta content={t(metadata.description)} property='og:description' />
      <meta content={new URL('/assets/screenshots/library.jpeg', metadata.link).href} property='og:image' />

      <meta content='summary_large_image' name='twitter:card' />
      <meta content={metadata.link} name='twitter:url' />
      <meta content={metadata.title} name='twitter:title' />
      <meta content={t(metadata.description)} name='twitter:description' />
      <meta content={new URL('/assets/screenshots/library.jpeg', metadata.link).href} name='twitter:image' />

      {/* perfermance */}
      <link href={cdnHost} rel='dns-prefetch' />
      <link crossOrigin='anonymous' href={cdnHost} rel='preconnect' />

      {headElements?.map(({ props, type }) => createElement(type, props))}

      <Meta />
      <Links />
    </head>
  )
}
