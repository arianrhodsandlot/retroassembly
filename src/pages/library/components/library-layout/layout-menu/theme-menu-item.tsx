import { DropdownMenu } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { delay } from 'es-toolkit'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { accentColors, type AccentColor, type AppearanceMode } from '#@/constants/theme.ts'
import { usePreference } from '#@/pages/library/hooks/use-preference.ts'

const accentColorIcons: Record<AccentColor, string> = {
  amber: 'text-amber-500',
  blue: 'text-blue-500',
  cyan: 'text-cyan-500',
  green: 'text-green-500',
  indigo: 'text-indigo-500',
  orange: 'text-orange-500',
  pink: 'text-pink-500',
  purple: 'text-purple-500',
  red: 'text-red-500',
  teal: 'text-teal-500',
}

export function ThemeMenuItem() {
  const { setTheme, systemTheme, theme } = useTheme()
  const { preference, update } = usePreference()
  const { t } = useTranslation()

  const currentAccentColor = preference?.ui?.accentColor || 'red'

  async function updateAppearance(newTheme: string) {
    await delay(100)
    if (newTheme) {
      localStorage.setItem('theme', newTheme)
      setTheme(newTheme)
    } else {
      localStorage.removeItem('theme')
      setTheme('system')
    }
    await update({ ui: { appearanceMode: (newTheme || 'system') as AppearanceMode } })
  }

  async function updateAccentColor(color: AccentColor) {
    await delay(100)
    await update({ ui: { accentColor: color } })
  }

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <span className='icon-[mdi--theme-light-dark]' />
        {t('Theme')}
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Label>{t('Appearance')}</DropdownMenu.Label>
        <DropdownMenu.Item onClick={() => updateAppearance('')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'system' })} />
          {systemTheme === 'light' ? <span className='icon-[mdi--weather-sunny]' /> : null}
          {systemTheme === 'dark' ? <span className='icon-[mdi--moon-and-stars]' /> : null}
          {t('System')}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => updateAppearance('light')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'light' })} />
          <span className='icon-[mdi--weather-sunny]' />
          {t('Light')}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => updateAppearance('dark')}>
          <span className={clsx('icon-[mdi--check]', { 'opacity-0': theme !== 'dark' })} />
          <span className='icon-[mdi--moon-and-stars]' />
          {t('Dark')}
        </DropdownMenu.Item>

        <DropdownMenu.Separator />
        <DropdownMenu.Label>{t('Accent Color')}</DropdownMenu.Label>
        {accentColors.map((color) => (
          <DropdownMenu.Item key={color} onClick={() => updateAccentColor(color)}>
            <span className={clsx('icon-[mdi--check]', { 'opacity-0': currentAccentColor !== color })} />
            <span className={clsx('icon-[mdi--circle]', accentColorIcons[color])} />
            {t(`theme_accent_${color}`)}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  )
}
