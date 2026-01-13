import type { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export function MainBackground({
  alt,
  src,
  ...props
}: { alt?: string; src?: string } & HTMLAttributes<HTMLDivElement>) {
  return src ? (
    <div
      className={twMerge(
        'absolute top-0 aspect-square w-full px-12 lg:fixed lg:right-0 lg:h-full lg:w-auto',
        props.className,
      )}
    >
      <img alt={alt || ''} className='absolute size-full object-cover object-center' loading='lazy' src={src} />
      <div className='*:absolute *:top-0 *:size-full *:from-(--color-background)/30 *:to-(--color-background)'>
        <div className='bg-linear-to-l' />
        <div className='bg-linear-to-b' />
      </div>
    </div>
  ) : null
}
