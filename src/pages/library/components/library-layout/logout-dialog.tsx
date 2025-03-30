import { AlertDialog, Button } from '@radix-ui/themes'
import { useRouter_UNSTABLE } from 'waku'

export function LogoutDialog(props: AlertDialog.RootProps) {
  const router = useRouter_UNSTABLE()

  function handleClickLogout() {
    router.push('/logout')
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title>Log out of RetroAssembly?</AlertDialog.Title>
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
            Logout
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
