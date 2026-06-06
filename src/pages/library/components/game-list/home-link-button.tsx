import { Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router'
import { routes } from '#@/pages/routes.ts'

export function HomeLinkButton() {
  const { t } = useTranslation()
  return (
    <Button asChild variant='soft'>
      <Link to={generatePath(routes.libraryHome)}>
        <span className='icon-[mdi--bookshelf]' /> {t('nav.home')}
      </Link>
    </Button>
  )
}
