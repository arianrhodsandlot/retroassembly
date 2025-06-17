import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useEmulator } from '../../hooks/use-emulator.ts'

interface VirtualGamepadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonName?: string
  buttonNames?: string[]
}

export function VirtualGamepadButton({
  buttonName,
  buttonNames,
  children,
  className,
  ...props
}: VirtualGamepadButtonProps) {
  const { emulator } = useEmulator()
  const [touching, setTouching] = useState(false)

  const resolvedButtonNames = buttonNames || (buttonName ? [buttonName] : [])

  function handleTouchStart() {
    if (emulator) {
      setTouching(true)
      for (const buttonName of resolvedButtonNames) {
        emulator.pressDown(buttonName)
      }
    }
  }

  function handleTouchEnd() {
    setTouching(false)
    if (emulator) {
      for (const buttonName of resolvedButtonNames) {
        emulator.pressUp(buttonName)
      }
    }
  }

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex select-none items-center justify-center gap-1',
          touching ? 'bg-white text-black' : 'bg-black/20 text-white/50',
        ),
        className,
      )}
      type='button'
      {...props}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      {children}
    </button>
  )
}
