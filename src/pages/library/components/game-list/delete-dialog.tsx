import { AlertDialog, Button } from '@radix-ui/themes'
import { delay, isPlainObject } from 'es-toolkit'
import { isMatch } from 'es-toolkit/compat'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { useSelectedGames } from '../../atoms.ts'
import { useRouter } from '../../hooks/use-router.ts'

const { $delete } = client.roms

export function DeleteDialog(props: Readonly<AlertDialog.RootProps>) {
  const { onOpenChange } = props
  const { reloadSilently } = useRouter()
  const [selectedGames, setSelectedGames] = useSelectedGames()
  const [clicked, setClicked] = useState(false)
  const { t } = useTranslation()

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'roms', method: 'delete', query: { ids: selectedGames.join(',') } },
    ({ query }) => $delete({ query }),
    {
      onError() {
        setClicked(false)
      },
      async onSuccess() {
        closeDeleteDialog()
        await delay(500) // waiting for animation
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
    await mutate((key) => isPlainObject(key) && isMatch(key, { endpoint: 'roms/search' }), false)
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>
          {t('Delete selected {{count}} {{items}}', {
            count: selectedGames.length,
            items: t('ROM', { count: selectedGames.length }),
          })}
        </AlertDialog.Title>
        <AlertDialog.Description className='leading-loose! whitespace-pre-line' size='2'>
          {t('Are you sure to proceed?\nThe deleted ROMs cannot be restored.')}
        </AlertDialog.Description>

        <div className='mt-4 flex justify-end gap-3'>
          <AlertDialog.Cancel>
            <Button disabled={isLoading}>
              <span className='icon-[mdi--close]' />
              {t('Cancel')}
            </Button>
          </AlertDialog.Cancel>
          <Button loading={isLoading} onClick={handleClickConfirmDelete} variant='soft'>
            <span className='icon-[mdi--delete]' />
            {t('Delete')}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
