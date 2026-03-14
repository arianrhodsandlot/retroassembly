import { Button } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

interface FavoriteButtonProps {
  isViewingFavorites: boolean
  getToggleLink: () => string
}

export function FavoriteButton({ isViewingFavorites, getToggleLink }: FavoriteButtonProps) {
  const { t } = useTranslation()

  return (
    <Button asChild variant={isViewingFavorites ? 'solid' : 'soft'}>
      <NavLink end to={getToggleLink()} className='group'>
        {({ isPending }) => (
          <>
            <span
              className={clsx({
                'icon-[mdi--heart-outline]': !isViewingFavorites,
                'icon-[mdi--heart]': isViewingFavorites,
              })}
            />
            {t('nav.favorites')}
            {isPending ? (
              <span className='icon-[svg-spinners--180-ring] hidden animate-spin group-focus:inline' />
            ) : null}
          </>
        )}
      </NavLink>
    </Button>
  )
}
