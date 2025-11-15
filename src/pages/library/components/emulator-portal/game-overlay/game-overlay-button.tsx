import { Button, type ButtonProps } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { type MouseEvent, type ReactNode, useState } from 'react'

interface GameOverlayButtonProps {
  children: Iterable<ReactNode>
  dataSnLeft?: string
  dataSnRight?: string
  disabled?: boolean
  onClick: ButtonProps['onClick']
}

export function GameOverlayButton({
  children,
  dataSnLeft,
  dataSnRight,
  disabled = false,
  onClick,
}: Readonly<GameOverlayButtonProps>) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    await onClick?.(event)
    setIsLoading(false)
  }

  const [icon, text] = children

  return (
    <Button
      className={clsx(
        'border! bg-black/30! text-white! shadow-none! transition-all! duration-300! border-solid border-white',
        'focus:text-(--accent-9)! focus:bg-white/80!',
        { 'opacity-40!': isLoading },
      )}
      data-sn-enabled
      data-sn-focus-style={JSON.stringify({
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
      })}
      data-sn-left={dataSnLeft}
      data-sn-right={dataSnRight}
      disabled={disabled}
      onClick={handleClick}
      radius='full'
      size='4'
      type='button'
      variant='outline'
    >
      {isLoading ? <span className='icon-[svg-spinners--180-ring] size-5' /> : icon}
      {text}
    </Button>
  )
}
