import { noop } from 'es-toolkit'
import type { ReactNode } from 'react'

export function GameOverlayButton({
  children,
  isLoading = false,
  onClick = noop,
}: { children: ReactNode; isLoading?: boolean; onClick?: any }) {
  return (
    <button
      className='backdrop-blur-xs flex items-center justify-center gap-2 rounded px-6 py-3 font-semibold text-white shadow-lg hover:bg-rose-700'
      disabled={isLoading}
      onClick={onClick}
      type='button'
    >
      {children}
    </button>
  )
}
