import { AlertDialog, Button } from '@radix-ui/themes'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { useGameActions } from '../../hooks/use-game-actions.ts'
import { useRouter } from '../../hooks/use-router.ts'

interface DeleteDialogProps extends AlertDialog.RootProps {
  rom: { id: string }
}

const { ':id': romsEndpoint } = client.roms

export function DeleteDialog({ rom, ...props }: Readonly<DeleteDialogProps>) {
  const { reloadSilently } = useRouter()
  const { actions } = useGameActions()
  const action = actions.find(({ name }) => name === 'delete')
  const type = action?.type as 'launch_records' | 'roms'
  const { $delete } = { launch_records: romsEndpoint.launch_records, roms: romsEndpoint }[type]
  const endpoint = { launch_records: 'roms/:id/launch_records', roms: 'roms' }[type]

  const [clicked, setClicked] = useState(false)
  const { isMutating, trigger } = useSWRMutation(
    { endpoint, method: 'delete', param: { id: rom.id } },
    ({ param }) => $delete({ param }),
    {
      onError() {
        setClicked(false)
      },
      onSuccess: () => {
        closeDeleteDialog()
      },
    },
  )

  const isLoading = clicked || isMutating
  function closeDeleteDialog() {
    if (!isMutating) {
      props.onOpenChange?.(false)
    }
  }

  async function handleClickConfirmDelete() {
    await trigger()
    closeDeleteDialog()
    await reloadSilently()
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
            <Button disabled={isLoading}>
              <span className='icon-[mdi--close]' />
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button loading={isLoading} onClick={handleClickConfirmDelete} variant='soft'>
            <span className='icon-[mdi--delete]' />
            Delete
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
