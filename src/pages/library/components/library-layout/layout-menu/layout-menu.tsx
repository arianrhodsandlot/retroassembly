import { Button, DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'
import { links } from '@/constants/links.ts'
import { useSpatialNavigationPaused } from '../../../atoms.ts'
import { useShowSearchModal } from '../atoms.ts'
import { ThemeMenuItem } from '../theme-menu-item.tsx'
import { AboutDialog } from './about-dialog.tsx'
import { LogoutDialog } from './logout-dialog.tsx'
import { SettingsDialog } from './settings-dialog/settings-dialog.tsx'

export function LayoutMenu() {
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [, setShowSearchModal] = useShowSearchModal()

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false)

  function handleClickSearch() {
    setSpatialNavigationPaused(true)
    setShowSearchModal(true)
  }

  function handleClickSettings() {
    setSettingsDialogOpen(true)
    setSpatialNavigationPaused(true)
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button aria-label='Menu' type='button'>
            <span className='icon-[mdi--menu]' />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant='solid'>
          <DropdownMenu.Item className='lg:!hidden' onClick={handleClickSearch}>
            <span className='icon-[mdi--search]' />
            Search
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={handleClickSettings}>
            <span className='icon-[mdi--cog]' />
            Settings
          </DropdownMenu.Item>

          <ThemeMenuItem />

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

          <DropdownMenu.Item color='red' onClick={() => setLogoutDialogOpen(true)}>
            <span className='icon-[mdi--logout]' />
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <SettingsDialog onOpenChange={setSettingsDialogOpen} open={settingsDialogOpen} />
      <LogoutDialog onOpenChange={setLogoutDialogOpen} open={logoutDialogOpen} />
      <AboutDialog onOpenChange={setAboutDialogOpen} open={aboutDialogOpen} />
    </>
  )
}
