import { useTranslation } from 'react-i18next'
import { links } from '#@/constants/links.ts'
import { metadata } from '#@/constants/metadata.ts'

export function FooterSection() {
  const { t } = useTranslation()

  const year = new Date().getFullYear()

  return (
    <footer className='border border-x-0 border-b-0 border-t-(--gray-4) p-8 text-center text-sm font-light text-(--gray-11)'>
      <div className='pb-safe mx-auto flex w-7xl max-w-full flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='flex flex-col items-center gap-4 sm:items-start'>
          <a className='flex items-center gap-2 font-serif font-bold text-(--accent-9)' href='/'>
            <img alt='logo' height='32' src='/assets/logo/logo.svg' width='32' />
            <span className='font-serif font-semibold'>{metadata.title}</span>
          </a>

          <div className='flex gap-4 text-lg'>
            {links.map((link) => (
              <a
                className='flex items-center'
                href={link.url}
                key={link.name}
                rel='noreferrer noopener'
                target='_blank'
                title={t(link.text)}
              >
                <span className={link.icon} />
              </a>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-center gap-0.5 sm:items-end'>
          <div className='inline-flex items-center justify-center gap-1'>
            <span className='icon-[mdi--copyright] size-3.5' />
            {year}
            <a
              className='underline'
              href='https://github.com/arianrhodsandlot'
              rel='noreferrer noopener'
              target='_blank'
            >
              @arianrhodsandlot
            </a>
          </div>
          <div>{t('All rights reserved')}</div>
        </div>
      </div>
    </footer>
  )
}
