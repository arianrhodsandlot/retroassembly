import { range } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { metadata } from '#@/constants/metadata.ts'
import { ButtonLinks } from '../../../components/button-links.tsx'

export function HeroMain() {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center justify-center'>
      <img alt='logo' className='size-40' src='/assets/logo/logo.svg' />
      <h1
        className='text-(--accent-9) lg:w-120 m-4 w-80 bg-clip-text text-center text-4xl font-[Roboto_Slab_Variable] font-semibold lg:text-6xl'
        style={{
          textShadow: range(1, 13)
            .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
            .join(','),
        }}
      >
        {metadata.title}
      </h1>
      <div className='relative mt-4 px-10 text-center'>
        <div className='text-(--gray-10) overflow-hidden rounded p-2 text-xl font-[Roboto_Slab_Variable]'>
          {t(metadata.description)}
        </div>
      </div>
      <ButtonLinks />
      <a
        className='mt-4 flex items-center gap-2 text-xs underline opacity-80'
        href='https://github.com/arianrhodsandlot/retroassembly#option-2-self-host-with-docker'
      >
        <span className='icon-[mdi--docker] motion-preset-oscillate motion-duration-2000 relative -top-0.5 text-2xl text-[#1d63ed]' />
        {t('Self-Hosting with Docker')}
      </a>
    </div>
  )
}
