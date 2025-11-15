import { Button } from '@radix-ui/themes'
import { createElement } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link, useLocation } from 'react-router'
import { metadata } from '@/constants/metadata.ts'
import { routes } from '@/pages/routes.ts'
import { getPlatformIcon } from '@/utils/client/library.ts'
import { usePlatform } from '../../hooks/use-platform.ts'
import { UploadButton } from '../../platform/components/upload-button.tsx'
import { UploadSelectButton } from '../../platform/components/upload-select-button.tsx'

export function GameListEmpty() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const platform = usePlatform()

  const isLibrary = pathname === routes.libraryRoms || pathname === routes.libraryHome
  const isHistory = pathname === routes.libraryHistory

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-16 text-sm lg:text-xl'>
      <span className='icon-[mdi--package-variant] size-32 text-zinc-300' />
      {isLibrary ? (
        <>
          <div className='text-(--gray-11)'>
            {t('Welcome to {{title}}. This is where all ROMs uploaded by you will appear.', {
              title: metadata.title,
            })}
          </div>
          <div className='text-(--gray-11) inline-flex items-center gap-1'>
            <Trans
              components={{
                1: <UploadSelectButton variant='soft' />,
              }}
              i18nKey='uploadRomsToGetStarted'
            />
          </div>
        </>
      ) : null}

      {isHistory ? (
        <>
          <div className='text-(--gray-11)'>{t("You haven't played any games yet.")}</div>
          <div className='text-(--gray-11) inline-flex items-center gap-1'>
            <Trans
              components={{
                1: createElement(() => (
                  <Button asChild variant='soft'>
                    <Link to={generatePath(routes.libraryHome)}>
                      <span className='icon-[mdi--bookshelf] ' /> {t('Home')}
                    </Link>
                  </Button>
                )),
              }}
              i18nKey='playSomeGamesFromLibrary'
            />
          </div>
        </>
      ) : null}

      {platform ? (
        <>
          <div className='text-(--gray-11) flex items-center gap-1'>
            <Trans
              components={{
                1: (
                  <img
                    alt={t(platform.displayName)}
                    className='hidden size-7 lg:inline-block'
                    loading='lazy'
                    src={getPlatformIcon(platform.name)}
                  />
                ),
              }}
              i18nKey='noGamesForPlatform'
              values={{
                platform: t(platform.displayName),
              }}
            />
          </div>
          <div className='text-(--gray-11) flex items-center gap-1'>
            <Trans
              components={{
                1: <UploadButton platform={platform?.name} variant='soft' />,
              }}
              i18nKey='uploadRomsToGetStarted'
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
