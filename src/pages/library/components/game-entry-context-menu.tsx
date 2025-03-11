'use client'
import { AlertDialog, Button, ContextMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useAtom } from 'jotai'
import ky from 'ky'
import type { ReactNode } from 'react'
import useSWRMutation from 'swr/mutation'
import { romsAtom } from '../atoms.ts'

export function GameEntryContextMenu({ children, rom }: { children: ReactNode; rom: any }) {
  const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false)

  const { isMutating, trigger } = useSWRMutation(`/api/v1/rom/${rom.id}`, (url) => ky.delete(url))

  const [, setAtoms] = useAtom(romsAtom)

  function closeDeleteDialog() {
    if (!isMutating) {
      toggleDeleteDialog()
    }
  }

  async function handleClickConfirmDelete() {
    await trigger()
    closeDeleteDialog()
    setAtoms((roms) => roms.filter(({ id }) => id !== rom.id))
  }

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item color='red' onClick={toggleDeleteDialog}>
            <span className='icon-[mdi--delete]' />
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>

      <AlertDialog.Root onOpenChange={toggleDeleteDialog} open={deleteDialogOpen}>
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Delete the ROM</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure to proceed? The deleted ROM and its saved states cannot be restored.
          </AlertDialog.Description>

          <div className='mt-4 flex justify-end gap-3'>
            <Button disabled={isMutating} onClick={handleClickConfirmDelete} variant='soft'>
              <span className='icon-[mdi--delete]' />
              Delete
            </Button>
            <AlertDialog.Cancel>
              <Button disabled={isMutating}>
                <span className='icon-[mdi--close]' />
                Cancel
              </Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
