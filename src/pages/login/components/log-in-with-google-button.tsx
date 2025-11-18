import { Button } from '@radix-ui/themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, Link } from 'react-router'
import { routes } from '#@/pages/routes.ts'

export function LogInWithGoogleButton({ redirectTo }: Readonly<{ redirectTo: string }>) {
  const { t } = useTranslation()
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    if (!clicked) {
      setClicked(true)
    }
  }
  return (
    <div className='text-center'>
      <Button asChild disabled={clicked} onClick={handleClick} size='3' type='submit' variant='soft'>
        <Link
          className='flex items-center gap-2'
          to={{
            pathname: generatePath(routes.loginGoogle),
            search: `?redirect_to=${encodeURIComponent(redirectTo)}`,
          }}
        >
          <span className='icon-[logos--google-icon]' />
          {t('Log in with Google')}
        </Link>
      </Button>
    </div>
  )
}
