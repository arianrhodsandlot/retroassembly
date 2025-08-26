import { AlertDialog, Button } from '@radix-ui/themes'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { useRoms } from '../../hooks/use-roms.ts'
import { useGameActions } from './hooks/use-game-actions.ts'

interface DeleteDialogProps extends AlertDialog.RootProps {
  rom: { id: string }
}

export function DeleteDialog({ rom, ...props }: DeleteDialogProps) {
  const { deleteRom } = useRoms()

  const { actions } = useGameActions(rom)
  const action = actions.find(({ name }) => name === 'delete')
  const { isMutating, trigger } = useSWRMutation(action?.api, (url) => api.delete(url))

  function closeDeleteDialog() {
    if (!isMutating) {
      props.onOpenChange?.(false)
    }
  }

  async function handleClickConfirmDelete() {
    await trigger()
    closeDeleteDialog()
    deleteRom(rom.id)
  }

  if (!action) {
    return
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>{action.text}</AlertDialog.Title>
        <AlertDialog.Description className='whitespace-pre-line !leading-loose' size='2'>
          {action.confirmDescription}
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
  )
}
