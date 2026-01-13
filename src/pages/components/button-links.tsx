import { Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function ButtonLinks() {
  const { t } = useTranslation()

  return (
    <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:*:min-w-48!'>
      <Button asChild radius='small' size='4' type='button'>
        <Link reloadDocument to='/demo'>
          <span className='icon-[mdi--presentation-play]' />
          {t('Live demo')}
        </Link>
      </Button>

      <Button asChild radius='small' size='4' type='button' variant='outline'>
        <Link
          className='border-2! bg-(--color-background)! shadow-none! in-[.dark]:border-(--gray-4)!'
          reloadDocument
          to='/library'
        >
          <span className='icon-[mdi--bookshelf]' />
          {t('Library')}
        </Link>
      </Button>
    </div>
  )
}
