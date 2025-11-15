import { useLayoutEffect } from 'react'
import { useNavigation } from 'react-router'
import { RadixThemePortal } from '@/pages/components/radix-theme-portal.tsx'
import { GameAnimatePresence } from './game-animate-presence.tsx'
import { GameOverlay } from './game-overlay/game-overlay.tsx'
import { useEmulator } from './hooks/use-emulator.ts'

export function EmulatorPortal() {
  const navigation = useNavigation()
  const { exit } = useEmulator()

  useLayoutEffect(() => {
    if (navigation.state === 'loading') {
      exit()
    }
    document.body.style.removeProperty('overflow')
  }, [exit, navigation.state])

  return (
    <RadixThemePortal>
      <GameOverlay />
      <GameAnimatePresence />
    </RadixThemePortal>
  )
}
