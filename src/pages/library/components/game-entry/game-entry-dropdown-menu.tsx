import { Checkbox, DropdownMenu, IconButton } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useSelectedGames } from '../../atoms.ts'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useGameActions } from '../../hooks/use-game-actions.ts'
import { DeleteDialog } from './delete-dialog.tsx'

export function GameEntryDropdownMenu({ rom }) {
  const isDemo = useIsDemo()
  const { actions } = useGameActions()
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGames, setSelectedGames] = useSelectedGames()

  function handleCheckedChange(checked: boolean) {
    setSelectedGames(checked ? [...selectedGames, rom.id] : selectedGames.filter((id) => id !== rom.id))
  }

  function handleClickSelect() {
    setSelectedGames([...selectedGames, rom.id])
  }

  function handleClickDelete() {
    setDeleteDialogOpen(true)
  }

  function handleClick(name: string) {
    const handlers = { delete: handleClickDelete, select: handleClickSelect }
    const handler = handlers[name]
    handler?.()
  }

  if (isDemo) {
    return
  }

  if (selectedGames.length > 0) {
    return (
      <div className='absolute right-1 top-1 z-10'>
        <Checkbox checked={selectedGames.includes(rom.id)} onCheckedChange={handleCheckedChange} value={rom.id} />
      </div>
    )
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
            <IconButton aria-label='Menu' className='!bg-(--gray-1)' size='1' title='Menu' variant='ghost'>
              <span className='icon-[mdi--more-vert] text-(--red-9) font-bold' />
            </IconButton>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {actions.map((action) => (
            <DropdownMenu.Item color={action.color} key={action.name} onClick={() => handleClick(action.name)}>
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
