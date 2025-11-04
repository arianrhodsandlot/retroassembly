import { Button, Tooltip } from '@radix-ui/themes'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { Link, useLoaderData } from 'react-router'
import { links } from '@/constants/links.ts'
import type { loader } from '../routes/home.tsx'

function handleScrollToTop() {
  scrollTo({ behavior: 'smooth', top: 0 })
}

export function FixedHeader() {
  const { t } = useTranslation()
  const { currentUser } = useLoaderData<typeof loader>()

  return (
    <div className='border-b-(--accent-9) bg-(--accent-9) fixed z-10 flex w-full items-stretch justify-between border-b px-8 text-white shadow shadow-black/30'>
      <Link className='pt-safe-offset-4 self-center py-4 font-extrabold' to='/'>
        <img alt='Logo' className='motion-preset-expand' height={32} src='/assets/logo/logo-512x512.png' width={32} />
      </Link>
      <button className='flex-1' onClick={handleScrollToTop} title={t('Scroll to top')} type='button' />
      <div className='pt-safe-offset-4 flex items-center gap-4 py-4 text-xl'>
        {links.map((link) => (
          <Fragment key={link.name}>
            {link.name === 'GitHub' ? (
              <Tooltip
                content={
                  <span>
                    {t('Your feedback matters!')}
                    <br />
                    {t('Star this project on GitHub to show your appreciation.')}
                  </span>
                }
                defaultOpen
              >
                <a
                  className='flex items-center '
                  href={link.url}
                  rel='noreferrer noopener'
                  target='_blank'
                  title={link.text}
                >
                  <span className={link.icon} />
                </a>
              </Tooltip>
            ) : (
              <a
                className='flex items-center '
                href={link.url}
                rel='noreferrer noopener'
                target='_blank'
                title={link.text}
              >
                <span className={link.icon} />
              </a>
            )}
          </Fragment>
        ))}
        <div className='h-5 w-px bg-white/50' />
        {currentUser ? (
          <div className='flex items-center '>
            <Button asChild size='2' type='button' variant='outline'>
              <Link className='rounded-full! border-2! bg-white! shadow-none!' reloadDocument to='/library'>
                <span className='icon-[mdi--bookshelf]' />
                {t('Library')}
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild radius='full' size='2' type='button' variant='outline'>
            <Link className='border-2! bg-white! shadow-none!' reloadDocument to='/login'>
              <span className='icon-[mdi--user-box]' />
              {t('Log in')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
