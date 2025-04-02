'use client'
import { Button, DropdownMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { settingsDialogOpenAtom, useAboutDialogOpen } from '../../atoms.ts'
import { AboutDialog } from './about-dialog.tsx'
import { LogoutDialog } from './logout-dialog.tsx'
import { SettingsDialog } from './settings-dialog/settings-dialog.tsx'

export function SidebarFooter() {
  const [settingsDialogOpen, setSettingsDialogOpen] = useAtom(settingsDialogOpenAtom)
  const [logoutDialogOpen, toggleLogoutDialog] = useToggle()
  const [aboutDialogOpen, setAboutDialogOpen] = useAboutDialogOpen()

  return (
    <>
      <div className='flex justify-center gap-2'>
        <Button onClick={() => setAboutDialogOpen(true)} size='1'>
          <span className='icon-[mdi--information]' />
        </Button>

        <Button onClick={() => setSettingsDialogOpen(true)} size='1'>
          <span className='icon-[mdi--cog]' />
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button size='1'>
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

      <AboutDialog onOpenChange={setAboutDialogOpen} open={aboutDialogOpen} />
      <SettingsDialog onOpenChange={setSettingsDialogOpen} open={settingsDialogOpen} />
      <LogoutDialog onOpenChange={toggleLogoutDialog} open={logoutDialogOpen} />
    </>
  )
}
