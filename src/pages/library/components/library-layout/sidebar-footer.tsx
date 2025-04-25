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
      <div className='flex justify-between gap-2'>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button size='1'>
              <span className='icon-[mdi--cog]' />
            </Button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant='solid'>
            <DropdownMenu.Item onClick={() => setSettingsDialogOpen(true)}>
              <span className='icon-[mdi--wrench]' />
              Settings
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

            <DropdownMenu.Item onClick={() => setAboutDialogOpen(true)}>
              <span className='icon-[mdi--information]' />
              About
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a href='https://github.com/arianrhodsandlot/retro-assembly' rel='noopener noreferrer' target='_blank'>
                <span className='icon-[mdi--github]' />
                <span className='flex items-start gap-1'>
                  GitHub
                  <sub className='icon-[mdi--open-in-new]' />
                </span>
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <a href='https://discord.gg/gwaKRAYG6t' rel='noopener noreferrer' target='_blank'>
                <span className='icon-[mdi--discord]' />
                <span className='flex items-start gap-1'>
                  Discord
                  <sub className='icon-[mdi--open-in-new]' />
                </span>
              </a>
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

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
