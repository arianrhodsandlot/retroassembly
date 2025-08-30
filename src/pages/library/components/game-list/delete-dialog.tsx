import { AlertDialog, Button } from '@radix-ui/themes'
import { delay } from 'es-toolkit'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { api } from '@/utils/http.ts'
import { useSelectedGames } from '../../atoms.ts'
import { useRouter } from '../../hooks/use-router.ts'

export function DeleteDialog(props: Readonly<AlertDialog.RootProps>) {
  const { onOpenChange } = props
  const { reloadSilently } = useRouter()
  const [selectedGames, setSelectedGames] = useSelectedGames()
  const [clicked, setClicked] = useState(false)

  const { isMutating, trigger } = useSWRMutation(
    'roms',
    (url) =>
      api.delete(url, {
        searchParams: { ids: selectedGames.join(',') },
      }),
    {
      onError() {
        setClicked(false)
      },
      async onSuccess() {
        closeDeleteDialog()
        await delay(500)
        setSelectedGames([])
      },
    },
  )

  const isLoading = clicked || isMutating

  function closeDeleteDialog() {
    if (!isMutating) {
      onOpenChange?.(false)
    }
  }

  async function handleClickConfirmDelete() {
    setClicked(true)
    await trigger()
    await reloadSilently()
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>
          Delete selected {selectedGames.length} {selectedGames.length === 1 ? 'ROM' : 'ROMs'}
        </AlertDialog.Title>
        <AlertDialog.Description className='whitespace-pre-line !leading-loose' size='2'>
          {'Are you sure to proceed?\nThe deleted ROM cannot be restored.'}
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
