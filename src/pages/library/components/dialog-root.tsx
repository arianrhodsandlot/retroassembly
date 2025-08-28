import { Dialog } from '@radix-ui/themes'
import { useSpatialNavigationPaused } from '../atoms.ts'

export function DialogRoot({ onOpenChange, ...props }: Readonly<Dialog.RootProps>) {
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()

  function handleOpenChange(open: boolean) {
    setSpatialNavigationPaused(open)
    onOpenChange?.(open)
  }

  return <Dialog.Root {...props} onOpenChange={handleOpenChange} />
}
