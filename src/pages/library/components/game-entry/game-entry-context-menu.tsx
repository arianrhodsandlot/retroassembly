import { AlertDialog, Button, ContextMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import ky from 'ky'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { useIsDemo } from '../../hooks/use-demo.ts'
import { useRoms } from '../../hooks/use-roms.ts'

export function GameEntryContextMenu({ children, rom }: { children: ReactNode; rom: any }) {
  const isDemo = useIsDemo()
  const location = useLocation()
  const { deleteRom } = useRoms()

  const [deleteDialogOpen, toggleDeleteDialog] = useToggle(false)

  const pageType = location.pathname === '/library/history' ? 'history' : 'library'
  const { confirmDescription, confirmTitle, deleteApi, menuText } = {
    history: {
      confirmDescription:
        'Are you sure to proceed?\nThe deleted history item cannot be restored.\nThe ROM related to this history item will NOT be deleted.',
      confirmTitle: 'Delete from history',
      deleteApi: `/api/v1/roms/${rom.id}/launch_records`,
      menuText: 'Delete from history',
    },
    library: {
      confirmDescription: 'Are you sure to proceed?\nThe deleted ROM cannot be restored.',
      confirmTitle: 'Delete the ROM',
      deleteApi: `/api/v1/roms/${rom.id}`,
      menuText: 'Delete the ROM',
    },
  }[pageType]

  const { isMutating, trigger } = useSWRMutation(deleteApi, (url) => ky.delete(url))

  function closeDeleteDialog() {
    if (!isMutating) {
      toggleDeleteDialog()
    }
  }

  async function handleClickConfirmDelete() {
    await trigger()
    closeDeleteDialog()
    deleteRom(rom.id)
  }

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger disabled={isDemo}>{children}</ContextMenu.Trigger>
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
              <Button disabled={isMutating}>
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
