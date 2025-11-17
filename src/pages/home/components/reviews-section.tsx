import { range } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { metadata } from '@/constants/metadata.ts'

interface Review {
  avatar: string
  contentKey: string
  name: string
  role?: string
  site: string
  url: string
}

export function ReviewsSection() {
  const { t } = useTranslation()

  const reviews: Review[] = [
    {
      avatar: 'https://gardinerbryant.com/content/images/2025/10/IMG20230222140721.jpg',
      contentKey: 'review_dash',
      name: 'Dash',
      site: 'The Bryant Review',
      url: 'https://gardinerbryant.com/inside-retroassembly-a-conversation-with-its-creator/',
    },
    {
      avatar: 'https://rh-handhelds-content.nyc3.cdn.digitaloceanspaces.com/2023/09/jim-gray-onionos-jpg.webp',
      contentKey: 'review_jim_gray',
      name: 'Jim Gray',
      role: 'Retro Collector',
      site: 'Retro Handhelds',
      url: 'https://retrohandhelds.gg/how-to-setup-retroassembly/',
    },
    {
      avatar:
        'https://secure.gravatar.com/avatar/721f7446b6872aab6425482bd663168e79efea702cca60530d5e1a15e18f51fc?s=256',
      contentKey: 'review_robert_triggs',
      name: 'Robert Triggs',
      site: 'Android Authority',
      url: 'https://www.androidauthority.com/retroassembly-nas-3612845/',
    },
    {
      avatar: 'https://img.mailinblue.com/1942795/images/rnb/original/60c81d2e8cde7d70953262c6.png',
      contentKey: 'review_korben',
      name: 'Korben',
      site: "L'actu tech & geek de Korben",
      url: 'https://korben.info/retroassembly-collection-jeux-retro-navigateur-web.html',
    },
  ]

  return (
    <section>
      <div className='mx-auto max-w-6xl'>
        <h2
          className='text-(--accent-9) border-b-(--gray-4) border-t-(--gray-4) mb-6 flex items-center justify-center gap-2 border border-transparent py-8 text-4xl font-[Roboto_Slab_Variable] font-semibold lg:py-16'
          style={{
            textShadow: range(1, 5)
              .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
              .join(','),
          }}
        >
          <span className='icon-[mdi--comment-text-multiple]' />
          {t('Reviews')}
        </h2>

        <div className='text-(--color-text)/60 mb-6 p-4 text-center text-lg font-light'>
          {t('People are saying great things about {{title}}!', { title: metadata.title })}
        </div>

        <div className='grid grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-2 lg:pb-16'>
          {reviews.map((review) => (
            <div
              className='border-(--gray-6) relative flex flex-col gap-4 rounded border p-8 lg:px-14'
              key={review.name}
            >
              <span className='icon-[mdi--format-quote-open] text-(--accent-4) absolute left-0 top-0 text-5xl lg:text-6xl' />
              <p className='flex-1 text-justify font-[Roboto_Slab_Variable] leading-relaxed opacity-80'>
                {t(review.contentKey)}
              </p>

              <a
                className='flex items-center justify-end gap-3 text-xs underline'
                href={review.url}
                rel='noopener noreferrer'
                target='_blank'
              >
                <img alt={review.name} className='block size-6 rounded-full object-cover' src={review.avatar} />
                <span>
                  <span className='font-semibold'>{review.name}</span> - {review.site}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
