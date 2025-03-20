import type { JSX, ReactNode } from 'react'

export function SettingsTitle({ as = 'h3', children }: { as?: keyof JSX.IntrinsicElements; children: ReactNode }) {
  const Tag = as
  return <Tag className='flex items-center gap-2 py-2 text-lg font-semibold'>{children}</Tag>
}
