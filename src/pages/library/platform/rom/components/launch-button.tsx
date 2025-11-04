import { Button, type ButtonProps } from '@radix-ui/themes'
import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

interface LaunchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonProps['variant']
}

export function LaunchButton({ children, disabled, variant = 'solid', ...props }: Readonly<LaunchButtonProps>) {
  return (
    <button
      aria-disabled={disabled ? 'true' : 'false'}
      className={clsx('launch-button block w-full lg:w-80', { 'opacity-50': disabled })}
      data-sn-enabled
      {...props}
      type='button'
    >
      <Button asChild radius='small' size='4' variant={variant}>
        <div
          className={clsx('h-16! w-full!', {
            'bg-(--color-background)! border-2! shadow-none!': variant === 'outline',
          })}
        >
          {children}
        </div>
      </Button>
    </button>
  )
}
