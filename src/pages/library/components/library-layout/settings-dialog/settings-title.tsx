import type { JSX, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface SettingsTitleProps {
  as?: keyof JSX.IntrinsicElements
  children: ReactNode
  className?: string
}

export function SettingsTitle({ as = 'h3', children, className }: Readonly<SettingsTitleProps>) {
  const Tag = as
  return <Tag className={twMerge('mb-2 flex items-center gap-2 text-lg font-semibold', className)}>{children}</Tag>
}
