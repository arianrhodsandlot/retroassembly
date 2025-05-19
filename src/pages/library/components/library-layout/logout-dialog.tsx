import { AlertDialog, Button } from '@radix-ui/themes'
import { metadata } from '@/constants/metadata.ts'

function handleClickLogout() {
  location.assign('/logout')
}

export function LogoutDialog(props: AlertDialog.RootProps) {
  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title className='flex items-center gap-2'>
          <span className='icon-[mdi--hand-wave]' />
          Log out of {metadata.title}?
        </AlertDialog.Title>

        <AlertDialog.Description>You can always log back in at any time.</AlertDialog.Description>

        <div className='flex justify-end gap-4'>
          <AlertDialog.Cancel>
            <Button variant='soft'>
              <span className='icon-[mdi--close]' />
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button onClick={handleClickLogout}>
            <span className='icon-[mdi--logout]' />
            Log out
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
