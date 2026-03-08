import { Button, DropdownMenu } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

interface SortDropdownProps {
  currentSort: string
  currentDirection: string
  buildSortLink: (params: Record<string, string>) => string
}

export function SortDropdown({ currentSort, currentDirection, buildSortLink }: SortDropdownProps) {
  const { t } = useTranslation()

  const sortOptions = [
    { icon: 'icon-[mdi--pencil]', label: t('Name'), value: 'name' },
    { icon: 'icon-[mdi--clock]', label: t('Date Added'), value: 'added' },
    { icon: 'icon-[mdi--calendar]', label: t('Released'), value: 'released' },
  ]

  const directionOptions = [
    { icon: 'icon-[mdi--sort-ascending]', label: t('Ascending'), value: 'asc' },
    { icon: 'icon-[mdi--sort-descending]', label: t('Descending'), value: 'desc' },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant='soft'>
          <span className='icon-[mdi--sort]' />
          {t('Sort')}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>{t('Sort By')}</DropdownMenu.Label>
        {sortOptions.map(({ icon, label, value }) => (
          <DropdownMenu.Item asChild key={value}>
            <Link to={buildSortLink({ direction: currentDirection, sort: value })}>
              <span className={clsx('icon-[mdi--check]', { 'opacity-0': value !== currentSort })} />
              <span className={icon} />
              {label}
            </Link>
          </DropdownMenu.Item>
        ))}

        <DropdownMenu.Separator />

        <DropdownMenu.Label>{t('Sort Direction')}</DropdownMenu.Label>
        {directionOptions.map(({ icon, label, value }) => (
          <DropdownMenu.Item asChild key={value}>
            <Link to={buildSortLink({ direction: value, sort: currentSort })}>
              <span className={clsx('icon-[mdi--check]', { 'opacity-0': value !== currentDirection })} />
              <span className={icon} />
              {label}
            </Link>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
