import { noop } from 'es-toolkit'
import type { ReactNode } from 'react'

export function GameOverlayButton({
  children,
  isLoading = false,
  onClick = noop,
}: { children: ReactNode; isLoading?: boolean; onClick?: any }) {
  return (
    <button
      className='border-3 flex items-center justify-center gap-2 rounded border-white bg-black/40 px-6 py-4 text-xl font-semibold text-white'
      disabled={isLoading}
      onClick={onClick}
      type='button'
    >
      {children}
    </button>
  )
}
