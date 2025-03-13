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
      className='[--accent-a11:white] [--accent-a3:rgba(0,0,0,.3)] [--accent-a4:rgba(0,0,0,.3)] [--accent-a5:rgba(0,0,0,.2)] [--accent-a8:white] [--gray-a3:rgba(0,0,0,.2)] [--gray-a8:white]'
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
