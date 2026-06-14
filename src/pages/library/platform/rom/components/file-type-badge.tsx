import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const typeIconMap: Record<string, string> = {
  cbz: 'icon-[mdi--book-open-page-variant]',
  pdf: 'icon-[mdi--file-pdf-box]',
  video: 'icon-[mdi--video]',
  youtube: 'icon-[mdi--youtube]',
}

interface FileTypeBadgeProps {
  className?: string
  type: string
}

export function FileTypeBadge({ className, type }: Readonly<FileTypeBadgeProps>) {
  const icon = typeIconMap[type]
  return icon ? (
    <span className={twMerge('flex items-center justify-center rounded bg-black/60', className)}>
      <span className={clsx(icon, 'text-white')} />
    </span>
  ) : null
}
