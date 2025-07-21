import { Button, type ButtonProps } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, useEffect, useRef } from 'react'
import { focus } from '@/pages/library/utils/spatial-navigation.ts'

interface LaunchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonProps['variant']
}

export function LaunchButton({ children, disabled, variant = 'solid', ...props }: LaunchButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!disabled && ref.current) {
      ref.current.dataset.snFocusStyle = JSON.stringify({ transitionProperty: 'none' })
      focus(ref.current)
      delete ref.current.dataset.snFocusStyle
    }
  }, [disabled])

  return (
    <button
      className={clsx('launch-button block w-full lg:w-80', { 'opacity-50': disabled })}
      data-sn-enabled
      disabled={disabled}
      {...props}
      type='button'
    >
      <Button asChild radius='small' size='4' type='button' variant={variant}>
        <div
          className={clsx('!h-16 !w-full', {
            '!bg-(--color-background) !border-2 !shadow-none': variant === 'outline',
          })}
        >
          {children}
        </div>
      </Button>
    </button>
  )
}
