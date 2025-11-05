import { Button, DropdownMenu } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { links } from '@/constants/links.ts'
import { useSettingsDialogOpen, useSpatialNavigationPaused } from '../../../atoms.ts'
import { useShowSearchModal } from '../atoms.ts'
import { AboutDialog } from './about-dialog.tsx'
import { LogoutDialog } from './logout-dialog.tsx'
import { SettingsDialog } from './settings-dialog/settings-dialog.tsx'
import { ThemeMenuItem } from './theme-menu-item.tsx'

export function LayoutMenu() {
  const { t } = useTranslation()
  const [, setSpatialNavigationPaused] = useSpatialNavigationPaused()
  const [, setShowSearchModal] = useShowSearchModal()

  const [settingsDialogOpen, setSettingsDialogOpen] = useSettingsDialogOpen()
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
          <Button aria-label={t('Menu')} type='button'>
            <span className='icon-[mdi--menu]' />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content variant='solid'>
          <DropdownMenu.Item className='lg:hidden!' onClick={handleClickSearch}>
            <span className='icon-[mdi--search]' />
            {t('Search')}
          </DropdownMenu.Item>

          <DropdownMenu.Item onClick={handleClickSettings}>
            <span className='icon-[mdi--cog]' />
            {t('Settings')}
          </DropdownMenu.Item>

          <ThemeMenuItem />

          <DropdownMenu.Separator />

          <DropdownMenu.Item onClick={() => setAboutDialogOpen(true)}>
            <span className='icon-[mdi--information]' />
            {t('About')}
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
            {t('Log out')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <SettingsDialog onOpenChange={setSettingsDialogOpen} open={settingsDialogOpen} />
      <LogoutDialog onOpenChange={setLogoutDialogOpen} open={logoutDialogOpen} />
      <AboutDialog onOpenChange={setAboutDialogOpen} open={aboutDialogOpen} />
    </>
  )
}
