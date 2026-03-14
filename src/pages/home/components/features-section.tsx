import { clsx } from 'clsx'
import { range } from 'es-toolkit'
import { useTranslation } from 'react-i18next'
import { getPlatformDeviceBackground, getRomLibretroThumbnail } from '#@/utils/client/library.ts'
import { DemoFocusIndicator } from '../../components/demo-focus-indicator.tsx'
import rewindImage from './rewind-image.png'

function useFeatures() {
  const { t } = useTranslation()

  return [
    {
      content: (
        <div className='*:motion-preset-pulse *:motion-duration-1000 flex size-full items-center justify-evenly bg-(--gray-4) bg-cover bg-center'>
          <span className='icon-[logos--chrome] size-14' />
          <span className='icon-[logos--microsoft-edge] motion-delay-100 size-14' />
          <span className='icon-[logos--safari] motion-delay-200 size-14' />
          <span className='icon-[logos--firefox] motion-delay-300 size-14' />
        </div>
      ),
      description: t('home.browserGameplayDescription'),
      icon: 'icon-[mdi--web-box]',
      title: t('home.browserGameplayTitle'),
    },
    {
      content: (
        <div className='relative flex size-full flex-col justify-center'>
          <div className='grid size-full grid-cols-3 grid-rows-3 rounded'>
            {['nes', 'snes', 'megadrive', 'gb', 'gba', 'gamegear', 'atari2600', 'arcade'].map((platform) => (
              <div className='overflow-hidden' key={platform}>
                <img
                  alt={platform}
                  className={clsx('size-full scale-110 object-contain object-center')}
                  loading='lazy'
                  src={getPlatformDeviceBackground(platform)}
                />
              </div>
            ))}
            <div className='flex items-center justify-center text-center font-semibold text-(--gray-9)'>
              {t('common.andMore')}
            </div>
          </div>
        </div>
      ),
      description: t('home.multiPlatformDescription'),
      icon: 'icon-[mdi--dice-multiple]',
      title: t('home.multiPlatformTitle'),
    },
    {
      content: (
        <div
          className='flex size-full items-center justify-center gap-2'
          style={{
            background:
              'radial-gradient(circle, transparent 20%, var(--color-background) 20%, var(--color-background) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, var(--color-background) 20%, var(--color-background) 80%, transparent 80%, transparent) 25px 25px, linear-gradient(var(--gray-5) 2px, transparent 2px) 0 -1px, linear-gradient(90deg, var(--gray-5) 2px, var(--color-background) 2px) -1px 0',
            backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px',
          }}
        >
          <span className='icon-[noto--laptop] size-16' />
          <span className='icon-[svg-spinners--bars-scale-middle] w-12 opacity-50' />
          <span className='icon-[noto--cloud] size-16' />
          <span className='icon-[svg-spinners--bars-scale-middle] w-12 opacity-50' />
          <span className='icon-[noto--desktop-computer] size-16' />
        </div>
      ),
      description: t('home.cloudSyncDescription'),
      icon: 'icon-[mdi--cloud]',
      title: t('home.cloudSyncTitle'),
    },
    {
      content: (
        <div className='grid h-full grid-cols-3 place-items-center gap-2'>
          {[
            { name: 'Metroid (USA)', platform: 'nes' },
            { name: 'Sonic & Knuckles (World)', platform: 'genesis' },
            { name: 'Pitfall II - Lost Caverns (USA)', platform: 'atari2600' },
          ].map(({ name, platform }) => (
            <div className='aspect-square overflow-hidden rounded bg-neutral-200' key={name}>
              <img
                alt={name}
                className='size-full object-contain'
                loading='lazy'
                src={getRomLibretroThumbnail(
                  {
                    platform,
                    rawGameMetadata: { libretro: { name } },
                  },
                  'boxart',
                  'libretro',
                )}
              />
            </div>
          ))}
        </div>
      ),
      description: t('settings.automaticBoxartDescription'),
      icon: 'icon-[mdi--drawing-box]',
      title: t('settings.automaticBoxart'),
    },
    {
      content: (
        <div className='relative size-full'>
          <div className='grid size-full grid-cols-3 grid-rows-2'>
            {range(6).map((i) => (
              <div className='rounded p-1' key={i}>
                <div className='flex size-full items-center justify-center rounded bg-(--gray-4)'>
                  <span
                    className={clsx(
                      'size-12',
                      [
                        'icon-[twemoji--mushroom]',
                        'icon-[twemoji--star]',
                        'icon-[twemoji--dragon]',
                        'icon-[twemoji--coin]',
                        'icon-[twemoji--racing-car]',
                        'icon-[twemoji--oncoming-fist]',
                      ][i],
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <DemoFocusIndicator />
        </div>
      ),
      description: t('home.keyboardNavigationDescription'),
      icon: 'icon-[mdi--controller-round]',
      title: t('home.keyboardNavigationTitle'),
    },
    {
      content: (
        <div className='relative size-full'>
          <div
            className='rewind-demo size-full animate-[rewind-demo-background-move_30s_linear_infinite] bg-cover'
            style={{
              backgroundImage: `url("${rewindImage}")`,
            }}
          />
          <div className='absolute top-0 left-0 flex size-full items-center justify-center'>
            <span className='icon-[svg-spinners--clock] size-32 rotate-x-180 opacity-50' />
          </div>
        </div>
      ),
      description: <>{t('home.rewindGameplayDescription')} ("Select" + "L2" ).</>,
      icon: 'icon-[mdi--clock-arrow]',
      title: t('home.rewindGameplayTitle'),
    },
  ]
}

export function FeaturesSection() {
  const { t } = useTranslation()
  const features = useFeatures()

  return (
    <section className='relative'>
      <h2
        className='mb-6 flex items-center justify-center gap-2 border border-transparent border-t-(--gray-4) border-b-(--gray-4) py-8 font-serif text-4xl font-semibold text-(--accent-9) lg:py-16'
        style={{
          textShadow: range(1, 5)
            .map(
              (number) =>
                `${number}px ${number}px 1px color-mix(in oklab, var(--accent-9) 50%, var(--color-background))`,
            )
            .join(','),
        }}
      >
        <span className='icon-[mdi--gift]' />
        {t('home.featuresTitle')}
      </h2>

      <ul className='flex flex-col'>
        {features.map((feature, index) => (
          <li className={clsx('py-8 lg:py-12', { 'bg-(--gray-3)': index % 2 })} key={feature.title}>
            <article
              className={clsx(
                'mx-auto flex w-full flex-col gap-6 px-8 lg:flex lg:w-5xl lg:flex-row lg:justify-center lg:gap-10',
                {
                  'lg:flex-row-reverse': index % 2,
                },
              )}
            >
              <div className='flex flex-1 items-center'>
                <div>
                  <header>
                    <h3 className='mb-2 flex items-center gap-2 text-xl font-semibold text-(--accent-9) lg:text-2xl'>
                      <span className={clsx(feature.icon, 'shrink-0 text-3xl lg:text-6xl')} />
                      <span>{feature.title}</span>
                    </h3>
                  </header>
                  <p className='pl-10 text-lg font-light text-(--color-text)/60 lg:pl-17'>{feature.description}</p>
                </div>
              </div>

              <div className='lg:flex lg:items-center lg:justify-center'>
                <figure className='rounded bg-(--color-background) p-2 ring-1 ring-(--color-text)/10'>
                  <div className='aspect-5/3 lg:h-60 lg:w-100'>{feature.content}</div>
                  <figcaption className='sr-only'>
                    {t('common.demoFor')} {feature.title}
                  </figcaption>
                </figure>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
