import { noop } from 'es-toolkit'
import { useSyncExternalStore } from 'react'
import { Links, Meta } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import { cdnHost } from '@/utils/cdn.ts'

export function Head() {
  const target = useSyncExternalStore(
    () => noop,
    () => (globalThis.self === globalThis.top ? '_self' : '_blank'),
    () => '_self',
  )

  return (
    <head lang='en' prefix='og: http://ogp.me/ns#'>
      <meta charSet='utf-8' />
      <meta content='width=device-width,initial-scale=1,viewport-fit=cover,shrink-to-fit=yes' name='viewport' />
      <meta content={metadata.themeColor} name='theme-color' />
      <meta content='telephone=no' name='format-detection' />

      <base target={target} />

      {/* metadata related */}
      <meta content={metadata.description} name='description' />
      <link href={metadata.link} rel='canonical' />

      <link href={new URL('/assets/logo/logo-192x192.png', metadata.link).href} rel='icon' sizes='any' />
      <link href={new URL('/assets/logo/logo.svg', metadata.link).href} rel='icon' type='image/svg+xml' />
      <link
        href={new URL('/assets/logo/apple-touch-icon.png', metadata.link).href}
        rel='apple-touch-icon'
        sizes='any'
      />

      <meta content='website' property='og:type' />
      <meta content={metadata.link} property='og:url' />
      <meta content={metadata.title} property='og:title' />
      <meta content={metadata.description} property='og:description' />
      <meta content={new URL('/assets/screenshots/library.jpeg', metadata.link).href} property='og:image' />

      <meta content='summary_large_image' name='twitter:card' />
      <meta content={metadata.link} name='twitter:url' />
      <meta content={metadata.title} name='twitter:title' />
      <meta content={metadata.description} name='twitter:description' />
      <meta content={new URL('/assets/screenshots/library.jpeg', metadata.link).href} name='twitter:image' />

      {/* perfermance */}
      <link href={cdnHost} rel='dns-prefetch' />
      <link crossOrigin='anonymous' href={cdnHost} rel='preconnect' />

      <Meta />
      <Links />
    </head>
  )
}
