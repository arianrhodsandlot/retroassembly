import { ContextMenu } from '@radix-ui/themes'
import { type ReactNode, useState } from 'react'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { DeleteDialog } from './delete-dialog.tsx'
import { useGameActions } from './hooks/use-game-actions.ts'

export function GameEntryContextMenu({ children, rom }: { children: ReactNode; rom: any }) {
  const isDemo = useIsDemo()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { actions } = useGameActions(rom)

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger disabled={isDemo}>{children}</ContextMenu.Trigger>
        <ContextMenu.Content>
          {actions.map((action) => (
            <ContextMenu.Item color={action.color} key={action.name} onClick={() => setDeleteDialogOpen(true)}>
              <span className={action.icon} />
              {action.text}
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>

      <DeleteDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} rom={rom} />
    </>
  )
}
