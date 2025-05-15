import { Button, DropdownMenu } from '@radix-ui/themes'
import { useToggle } from '@react-hookz/web'
import { useAtom } from 'jotai'
import { links } from '@/constants/links.ts'
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

            {links.map((link) => (
              <DropdownMenu.Item asChild key={link.name}>
                <a href={link.url} rel='noopener noreferrer' target='_blank'>
                  <span className={link.icon} />
                  <span className='flex items-start gap-1'>
                    {link.name}
                    <sub className='icon-[mdi--open-in-new]' />
                  </span>
                </a>
              </DropdownMenu.Item>
            ))}

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
