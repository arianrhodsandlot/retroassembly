import { Button, DropdownMenu } from '@radix-ui/themes'
import { Link, useLoaderData } from 'react-router'
import { locales } from '@/locales/index.ts'
import { defaultLanguage } from '@/utils/isomorphic/i18n.ts'

export function LanguageSelector() {
  const { language } = useLoaderData()
  const { code, name } = locales.find((lang) => lang.code === language) || locales[0]

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <Button title={name} type='button' variant='solid'>
          <span className='icon-[mdi--translate-variant]' />
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {locales.map((locale) => (
          <DropdownMenu.Item asChild key={locale.code}>
            <Link replace to={`/${locale.code === defaultLanguage ? '' : locale.code}`}>
              {locale.name}
              {locale.code === code ? <span className='icon-[mdi--check]' /> : null}
            </Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
