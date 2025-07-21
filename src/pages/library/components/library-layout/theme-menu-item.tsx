import { DropdownMenu } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { delay } from 'es-toolkit'
import { useTheme } from 'next-themes'

export function ThemeMenuItem() {
  const { setTheme, systemTheme, theme } = useTheme()

  async function updateTheme(theme: string) {
    await delay(100)
    if (theme) {
      localStorage.setItem('theme', theme)
      setTheme(theme)
    } else {
      localStorage.removeItem('theme')
      setTheme('system')
    }
  }

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <span className='icon-[mdi--theme-light-dark]' />
        Theme
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item onClick={() => updateTheme('')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'system' })} />
          {systemTheme === 'light' ? <span className='icon-[mdi--weather-sunny]' /> : null}
          {systemTheme === 'dark' ? <span className='icon-[mdi--moon-and-stars]' /> : null}
          System
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={() => updateTheme('light')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'light' })} />
          <span className='icon-[mdi--weather-sunny]' />
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => updateTheme('dark')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'dark' })} />
          <span className='icon-[mdi--moon-and-stars]' />
          Dark
        </DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  )
}
