import { useTranslation } from 'react-i18next'
import { ButtonLinks } from '../../components/button-links.tsx'
import { Paralolas } from '../../components/parabolas.tsx'
import background from './button-section-background.svg'

export function ButtonSection() {
  const { t } = useTranslation()

  return (
    <section className='relative py-8 lg:py-20'>
      <div
        className='absolute inset-0 opacity-10'
        style={{
          backgroundImage: `url("${background}"), url("${background}")`,
          backgroundPosition: 'top 0 left 0, top 48px left 48px',
          backgroundRepeat: 'repeat',
          backgroundSize: '192px 96px',
        }}
      />

      <div className='absolute inset-0 hidden lg:block'>
        <Paralolas />
      </div>

      <div className='relative mx-5 rounded-xl border-2 border-(--accent-9) bg-(--color-background) p-5 shadow-[0_0_4px_rgba(0,0,0,0.1)] in-[.dark]:bg-(--gray-2) lg:mx-auto lg:w-2xl'>
        <h2 className='flex items-center justify-center gap-2 text-center text-xl font-semibold text-(--accent-9) lg:text-3xl'>
          {t('Start to enjoy retro gaming now!')}
        </h2>

        <ButtonLinks />
      </div>
    </section>
  )
}
