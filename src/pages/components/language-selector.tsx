import { Button, DropdownMenu } from '@radix-ui/themes'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { locales } from '#@/locales/locales.ts'
import { getHomePath } from '#@/utils/isomorphic/misc.ts'
import { useGlobalLoaderData } from '../hooks/use-global-loader-data.ts'

const key = 'home-language'

function handleClickAuto() {
  Cookies.remove(key)
}

function handleClickLanguage(localeCode) {
  Cookies.set(key, localeCode)
}

export function LanguageSelector() {
  const { detectedLanguage } = useGlobalLoaderData()
  const { i18n, t } = useTranslation()
  const { code, name } = locales.find((lang) => lang.code === i18n.language) || locales[0]

  const selectedLanguage = Boolean(Cookies.get(key))

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <Button title={name} type='button' variant='solid'>
          <span className='icon-[mdi--translate-variant] size-5' />
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link onClick={handleClickAuto} replace to={getHomePath(detectedLanguage)}>
            {t('Auto')} ({locales.find(({ code }) => code === detectedLanguage)?.name})
            {selectedLanguage ? null : <span className='icon-[mdi--check]' />}
          </Link>
        </DropdownMenu.Item>
        {locales.map((locale) => (
          <DropdownMenu.Item asChild key={locale.code} onClick={() => handleClickLanguage(locale.code)}>
            <Link replace to={getHomePath(locale.code)}>
              {locale.name}
              {selectedLanguage && locale.code === code ? <span className='icon-[mdi--check]' /> : null}
            </Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
