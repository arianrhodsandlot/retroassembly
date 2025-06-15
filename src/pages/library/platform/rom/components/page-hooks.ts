import { useLayoutEffect } from 'react'
import { useNavigation } from 'react-router'
import { useEmulator } from '../hooks/use-emulator.ts'

export function PageHooks(): undefined {
  const navigation = useNavigation()
  const { exit } = useEmulator()

  useLayoutEffect(() => {
    if (navigation.state === 'loading') {
      exit()
    }
  }, [exit, navigation.state])
}
