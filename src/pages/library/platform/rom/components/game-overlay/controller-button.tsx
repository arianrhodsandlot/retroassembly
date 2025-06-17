import { clsx } from 'clsx'
import type { HTMLProps, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export function ControllerButton({ children, ...props }: PropsWithChildren<HTMLProps<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className={twMerge(
        clsx(
          'flex size-10 items-center justify-center rounded-sm text-2xl text-white transition-all',
          'hover:text-(--accent-9) hover:bg-white ',
        ),
        props.className,
      )}
      type='button'
    >
      {children}
    </button>
  )
}
