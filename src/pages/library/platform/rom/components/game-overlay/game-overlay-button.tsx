import { Button } from '@radix-ui/themes'
import { noop } from 'es-toolkit'
import type { ReactNode } from 'react'

export function GameOverlayButton({
  children,
  isLoading = false,
  onClick = noop,
}: { children: ReactNode; isLoading?: boolean; onClick?: any }) {
  return (
    <Button
      className='!border-1 border-solid border-white !bg-black/30 !text-white !shadow-none'
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
