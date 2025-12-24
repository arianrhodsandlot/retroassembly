import { AlertDialog, Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client } from '#@/api/client.ts'

interface DeleteUserDialogProps {
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  open: boolean
  userId: string
}

export function DeleteUserDialog({ onOpenChange, onSuccess, open, userId }: Readonly<DeleteUserDialogProps>) {
  const { t } = useTranslation()

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: `users/${userId}`, method: 'delete' },
    () =>
      client.users[':id'].$delete({
        param: { id: userId },
      }),
    {
      onSuccess: () => {
        onSuccess()
        onOpenChange(false)
      },
    },
  )

  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Content>
        <AlertDialog.Title>
          <div className='flex items-center'>
            <span className='icon-[mdi--delete] mr-2' />
            {t('Delete User')}
          </div>
        </AlertDialog.Title>
        <AlertDialog.Description>{t('Are you sure? This action cannot be undone.')}</AlertDialog.Description>
        <div className='mt-4 flex justify-end gap-3'>
          <AlertDialog.Cancel>
            <Button disabled={isMutating} variant='soft'>
              <span className='icon-[mdi--close]' />
              {t('Cancel')}
            </Button>
          </AlertDialog.Cancel>
          <Button color='red' loading={isMutating} onClick={() => trigger()} variant='soft'>
            <span className='icon-[mdi--delete]' />
            {t('Delete')}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
