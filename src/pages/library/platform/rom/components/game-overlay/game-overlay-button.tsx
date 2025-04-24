import { Button, type ButtonProps } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { clsx } from 'clsx'
import type { MouseEvent, ReactNode } from 'react'

export function GameOverlayButton({
  children,
  disabled = false,
  onClick,
}: { children: Iterable<ReactNode>; disabled?: boolean; onClick: ButtonProps['onClick'] }) {
  const [isLoading, toggleLoading] = useToggle()

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isLoading) {
      return
    }

    toggleLoading()
    await onClick?.(event)
    toggleLoading()
  }

  const [icon, text] = children

  return (
    <Button
      className={clsx(
        '!border-1 border-solid border-white !bg-black/30 !text-white !shadow-none !transition-all !duration-300',
        'focus:!text-(--accent-9) focus:!bg-white/80',
        { '!opacity-40': isLoading },
      )}
      data-sn-enabled
      data-sn-focus-style={JSON.stringify({
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
      })}
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
