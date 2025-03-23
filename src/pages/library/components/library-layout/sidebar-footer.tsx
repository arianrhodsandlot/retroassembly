'use client'
import { Button, DropdownMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { settingsDialogOpenAtom } from '../../atoms.ts'
import { LogoutDialog } from './logout-dialog.tsx'
import { SettingsDialog } from './settings-dialog/settings-dialog.tsx'

export function SidebarFooter() {
  const [settingsDialogOpen, setSettingsDialogOpenAtom] = useAtom(settingsDialogOpenAtom)
  const [logoutDialogOpen, toggleLogoutDialog] = useToggle()

  return (
    <>
      <div className='flex justify-center gap-2 border-t border-t-white/30 py-2'>
        <Button>
          <span className='icon-[mdi--information]' />
        </Button>

        <Button
          onClick={() => {
            setSettingsDialogOpenAtom(true)
          }}
        >
          <span className='icon-[mdi--cog]' />
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button>
              <span className='icon-[mdi--user]' />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant='solid'>
            <DropdownMenu.Item color='red' onClick={() => toggleLogoutDialog(true)}>
              <span className='icon-[mdi--logout]' />
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <SettingsDialog onOpenChange={setSettingsDialogOpenAtom} open={settingsDialogOpen} />
      <LogoutDialog onOpenChange={toggleLogoutDialog} open={logoutDialogOpen} />
    </>
  )
}
