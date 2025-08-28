import { clsx } from 'clsx'
import { type ReactNode, useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'
import { useFocusIndicator } from '../../hooks/use-focus-indicator.ts'
import { useGamepads } from '../../hooks/use-gamepads.ts'
import { usePreference } from '../../hooks/use-preference.ts'
import { useSpatialNavigation } from '../../hooks/use-spatial-navigation.ts'

export function FocusIndicator({ children }: { readonly children?: ReactNode }) {
  const { connected } = useGamepads()
  const { style, syncStyle } = useFocusIndicator()
  const location = useLocation()

  const { pristine } = useSpatialNavigation()
  const { preference } = usePreference()

  useLayoutEffect(() => {
    if (location.pathname) {
      syncStyle()
    }
  }, [location.pathname, syncStyle])

  let mergedStyle = style

  const { height, width } = mergedStyle
  if (typeof width === 'number' && typeof height === 'number') {
    const scale = (width + 16) / width
    mergedStyle = structuredClone(style)
    const cssVars = {
      '--motion-loop-scale-x': `${scale * 100}%`,
      '--motion-loop-scale-y': `${((width * (scale - 1)) / height + 1) * 100}%`,
    }
    Object.assign(mergedStyle, cssVars)
  }

  if (preference.ui.showFocusIndicators === 'never') {
    return
  }

  if (pristine) {
    return
  }

  return (
    <RadixThemePortal>
      <div
        className={clsx(
          'motion-scale-loop motion-duration-1200 motion-ease-in-out-quad bg-(--accent-a3) pointer-events-none fixed z-10 rounded',
          { 'hidden lg:block': !connected },
        )}
        style={mergedStyle}
      >
        {children}
      </div>
    </RadixThemePortal>
  )
}
