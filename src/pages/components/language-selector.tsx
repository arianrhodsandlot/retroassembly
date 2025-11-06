import { Button, DropdownMenu } from '@radix-ui/themes'
import { Link, useLoaderData } from 'react-router'

const languages = [
  { code: 'en', name: 'English', path: '' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-CN', name: '简体中文' },
]

export function LanguageSelector() {
  const { language } = useLoaderData()
  const { code, name } = languages.find((lang) => lang.code === language) || languages[0]

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger>
        <Button variant='solid'>
          <span className='icon-[mdi--translate-variant]' />
          <span className='hidden lg:inline'>{name}</span>
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {languages.map((lang) => (
          <DropdownMenu.Item asChild key={lang.code}>
            <Link replace to={`/${lang.path ?? lang.code}`}>
              {lang.name}
              {lang.code === code ? <span className='icon-[mdi--check]' /> : null}
            </Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
