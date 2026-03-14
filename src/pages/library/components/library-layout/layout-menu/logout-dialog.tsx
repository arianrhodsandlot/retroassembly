import { AlertDialog, Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { metadata } from '#@/constants/metadata.ts'

function handleClickLogout() {
  location.assign('/logout')
}

export function LogoutDialog(props: Readonly<AlertDialog.RootProps>) {
  const { t } = useTranslation()

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title className='flex items-center gap-2'>
          <span className='icon-[mdi--hand-wave]' />
          {t('dialog.logoutConfirmTitle', { title: metadata.title })}
        </AlertDialog.Title>

        <AlertDialog.Description>{t('auth.canAlwaysLogBackIn')}</AlertDialog.Description>

        <div className='mt-4 flex justify-end gap-4'>
          <AlertDialog.Cancel>
            <Button>
              <span className='icon-[mdi--close]' />
              {t('common.cancel')}
            </Button>
          </AlertDialog.Cancel>
          <Button onClick={handleClickLogout} variant='soft'>
            <span className='icon-[mdi--logout]' />
            {t('auth.logout')}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
