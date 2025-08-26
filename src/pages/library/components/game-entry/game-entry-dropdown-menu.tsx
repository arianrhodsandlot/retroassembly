import { DropdownMenu, IconButton } from '@radix-ui/themes'
import clsx from 'clsx'
import { useState } from 'react'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { DeleteDialog } from './delete-dialog.tsx'
import { useGameActions } from './hooks/use-game-actions.ts'

export function GameEntryDropdownMenu({ rom }) {
  const isDemo = useIsDemo()
  const { actions } = useGameActions(rom)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (isDemo) {
    return
  }

  return (
    <>
      <DropdownMenu.Root onOpenChange={setMenuOpen} open={menuOpen}>
        <DropdownMenu.Trigger>
          <div
            className={clsx('absolute right-1 top-1 z-10 transition-opacity group-hover:opacity-100', {
              'opacity-0': !menuOpen,
            })}
          >
            <IconButton className='!bg-(--gray-1)' size='1' title='Menu' variant='surface'>
              <span className='icon-[mdi--more-vert] text-(--red-9) font-bold' />
            </IconButton>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {actions.map((action) => (
            <DropdownMenu.Item color={action.color} key={action.name} onClick={() => setDeleteDialogOpen(true)}>
              <span className={action.icon} />
              {action.text}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <DeleteDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} rom={rom} />
    </>
  )
}
