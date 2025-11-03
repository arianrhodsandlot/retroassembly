import { useTranslation } from 'react-i18next'
import { linkMap, links } from '@/constants/links.ts'

export function CommunitySection() {
  const { t } = useTranslation()

  return (
    <section className='bg-(--accent-9) px-8 py-16 text-white'>
      <div className='mx-auto max-w-6xl lg:text-center'>
        <h2 className='mb-6 flex items-center justify-center gap-2 text-4xl font-[Roboto_Slab_Variable] font-semibold'>
          <span className='icon-[mdi--people-group]' />
          {t('Community')}
        </h2>
        <ul className='mb-4 inline-flex flex-col gap-2 py-4 text-sm leading-loose *:flex *:items-start *:gap-3'>
          <li>
            <span className='icon-[mdi--greeting] mt-1.5 shrink-0 text-lg' />
            <div>
              {t('We kindly request your assistance in reporting any ideas or bugs on our')}{' '}
              <a className='underline' href={linkMap.discord.url} rel='noreferrer noopener' target='_blank'>
                {t('Discord server')}
              </a>{' '}
              {t('or')}{' '}
              <a className='underline' href={linkMap.github.url} rel='noreferrer noopener' target='_blank'>
                {t('GitHub issues/discussions')}
              </a>
              .
            </div>
          </li>
          <li>
            <span className='icon-[mdi--comment-text-multiple-outline] mt-1.5 shrink-0 text-lg' />
            {t('Your valuable feedback will greatly contribute to enhancing the user experience.')}
          </li>
        </ul>
        <div className='flex flex-col justify-center gap-4 space-x-8 px-8 font-semibold lg:flex-row lg:px-0'>
          {links.map((link) => (
            <a
              className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-black lg:w-56'
              href={link.url}
              key={link.name}
              rel='noreferrer noopener'
              target='_blank'
            >
              <span className={link.logo} />
              {t(link.text)}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
