import { Button } from '@radix-ui/themes'
import clsx from 'clsx'
import { noop } from 'es-toolkit'
import type { ReactNode } from 'react'

export function GameOverlayButton({
  children,
  isLoading = false,
  onClick = noop,
}: { children: ReactNode; isLoading?: boolean; onClick?: any }) {
  return (
    <Button
      className={clsx(
        '!border-1 border-solid border-white !bg-black/30 !text-white !shadow-none !transition-all !duration-300',
        'focus:!bg-white/80 focus:!text-[var(--accent-9)]',
      )}
      data-sn-enabled
      data-sn-focus-style={JSON.stringify({
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '24px',
      })}
      disabled={isLoading}
      onClick={onClick}
      radius='full'
      size='4'
      type='button'
      variant='outline'
    >
      {children}
    </Button>
  )
}
