'use client'
import { AlertDialog, Button, ContextMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useAtom } from 'jotai'
import ky from 'ky'
import type { ReactNode } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRouter_UNSTABLE } from 'waku'
import { romsAtom } from '../../atoms.ts'

export function GameEntryContextMenu({ children, rom }: { children: ReactNode; rom: any }) {
  const router = useRouter_UNSTABLE()

  const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false)

  const pageType = router.path === '/library/history' ? 'history' : 'library'
  const { confirmDescription, confirmTitle, deleteApi, menuText } = {
    history: {
      confirmDescription:
        'Are you sure to proceed?\nThe deleted history item cannot be restored.\nThe ROM related to this history item will NOT be deleted.',
      confirmTitle: 'Delete the history item',
      deleteApi: `/api/v1/roms/${rom.id}/launch_records`,
      menuText: 'Delete the history item',
    },
    library: {
      confirmDescription: 'Are you sure to proceed?\nThe deleted ROM cannot be restored.',
      confirmTitle: 'Delete the ROM',
      deleteApi: `/api/v1/roms/${rom.id}`,
      menuText: 'Delete the ROM',
    },
  }[pageType]

  const { isMutating, trigger } = useSWRMutation(deleteApi, (url) => ky.delete(url))

  const [, setAtoms] = useAtom(romsAtom)

  function closeDeleteDialog() {
    if (!isMutating) {
      toggleDeleteDialog()
    }
  }

  async function handleClickConfirmDelete() {
    await trigger()
    closeDeleteDialog()
    setAtoms((roms) => roms?.filter(({ id }) => id !== rom.id))
  }

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item color='red' onClick={toggleDeleteDialog}>
            <span className='icon-[mdi--delete]' />
            {menuText}
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>

      <AlertDialog.Root onOpenChange={toggleDeleteDialog} open={deleteDialogOpen}>
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>{confirmTitle}</AlertDialog.Title>
          <AlertDialog.Description className='whitespace-pre-line' size='2'>
            {confirmDescription}
          </AlertDialog.Description>

          <div className='mt-4 flex justify-end gap-3'>
            <AlertDialog.Cancel>
              <Button disabled={isMutating} variant='soft'>
                <span className='icon-[mdi--close]' />
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button disabled={isMutating} onClick={handleClickConfirmDelete} variant='soft'>
              <span className='icon-[mdi--delete]' />
              Delete
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}
