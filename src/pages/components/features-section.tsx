import clsx from 'clsx'
import { range } from 'es-toolkit'
import { getPlatformDeviceBackground } from '@/utils/library.ts'
import { DemoFocusIndicator } from './demo-focus-indicator.tsx'
import rewindImage from './rewind-image.png'

const features = [
  {
    content: (
      <div className='*:motion-preset-pulse-sm *:motion-duration-1000 flex size-full items-center justify-evenly bg-neutral-50'>
        <span className='icon-[logos--chrome] size-14 ' />
        <span className='icon-[logos--microsoft-edge] motion-delay-100 size-14' />
        <span className='icon-[logos--safari] motion-delay-200 size-14' />
        <span className='icon-[logos--firefox] motion-delay-300 size-14' />
      </div>
    ),
    description: 'Play retro games directly in your browser without additional software.',
    icon: 'icon-[mdi--web-box]',
    title: 'Browser-Based Gameplay',
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
                src={getPlatformDeviceBackground(platform)}
              />
            </div>
          ))}
          <div className='text-(--accent-9) flex items-center justify-center text-center font-semibold'>
            ...and more!
          </div>
        </div>
      </div>
    ),
    description: 'Supports a wide range of retro gaming systems.',
    icon: 'icon-[mdi--space-invaders]',
    title: 'Multi-Platform Support',
  },
  {
    content: (
      <div className='flex size-full items-center justify-center gap-2'>
        <span className='icon-[noto--laptop] size-16' />
        <span className='icon-[svg-spinners--bars-scale-middle] w-12 opacity-50' />
        <span className='icon-[noto--cloud] size-16' />
        <span className='icon-[svg-spinners--bars-scale-middle] w-12 opacity-50' />
        <span className='icon-[noto--desktop-computer] size-16' />
      </div>
    ),
    description: 'Sync your games and states then access them from anywhere.',
    icon: 'icon-[mdi--cloud]',
    title: 'Cloud Sync',
  },
  {
    content: (
      <div className='grid h-full grid-cols-3 place-items-center gap-2'>
        <div className='aspect-square overflow-hidden rounded bg-neutral-200'>
          <img
            alt='mario'
            className='size-full object-contain'
            src='https://cdn.jsdelivr.net/gh/libretro-thumbnails/Nintendo_-_Nintendo_Entertainment_System@dbac0d8/Named_Boxarts/Super%20Mario%20Bros.%20(World).png'
          />
        </div>
        <div className='aspect-square overflow-hidden rounded bg-neutral-200'>
          <img
            alt='sonic'
            className='size-full object-contain'
            src='https://cdn.jsdelivr.net/gh/libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis@fa29730/Named_Boxarts/Sonic%20The%20Hedgehog%20(USA,%20Europe).png'
          />
        </div>
        <div className='aspect-square overflow-hidden rounded bg-neutral-200'>
          <img
            alt='pitfall'
            className='size-full object-contain'
            src='https://cdn.jsdelivr.net/gh/libretro-thumbnails/Atari_-_2600@a6a54d3/Named_Boxarts/Pitfall%20II%20-%20Lost%20Caverns%20(USA).png'
          />
        </div>
      </div>
    ),
    description: "Automatically fetch game boxarts to enhance your library's visual appeal.",
    icon: 'icon-[mdi--drawing-box]',
    title: 'Automatic Boxart Retrieval',
  },
  {
    content: (
      <div className='relative size-full'>
        <div className='grid size-full grid-cols-3 grid-rows-2'>
          {range(6).map((i) => (
            <div className='rounded p-1' key={i}>
              <div className='flex size-full items-center justify-center rounded bg-neutral-100'>
                <span className='icon-[twemoji--star] size-12' />
              </div>
            </div>
          ))}
        </div>
        <DemoFocusIndicator />
      </div>
    ),
    description: 'Navigate seamlessly using a joystick without needing a mouse or keyboard.',
    icon: 'icon-[mdi--controller-round]',
    title: 'Joystick-Friendly Navigation',
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
        <div className='absolute left-0 top-0 flex size-full items-center justify-center'>
          <span className='icon-[svg-spinners--clock] rotate-x-180 size-32 opacity-50' />
        </div>
      </div>
    ),
    description: (
      <>
        Rewind gameplay using "R" on the keyboard or a controller button combination (<kbd>Select</kbd> + <kbd>L2</kbd>
        ).
      </>
    ),
    icon: 'icon-[mdi--clock-arrow]',
    title: 'Rewind Gameplay',
  },
]

export function FeaturesSection() {
  return (
    <section className='relative'>
      <h2
        className='text-(--accent-9) mb-6 flex items-center justify-center gap-2 border border-transparent border-b-neutral-100 border-t-neutral-200 py-8 text-4xl font-[Roboto_Slab_Variable] font-semibold lg:py-16'
        style={{
          textShadow: range(1, 5)
            .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
            .join(','),
        }}
      >
        <span className='icon-[mdi--gift]' />
        Features
      </h2>

      <div className='flex flex-col'>
        {features.map((feature, index) => (
          <div className={clsx('py-8 lg:py-12', { 'bg-neutral-50': index % 2 })} key={feature.title}>
            <div
              className={clsx(
                'lg:w-5xl mx-auto flex w-full flex-col gap-6 px-8 lg:flex lg:flex-row lg:justify-center lg:gap-10',
                {
                  'lg:flex-row-reverse': index % 2,
                },
              )}
            >
              <div className='flex flex-1 items-center'>
                <div>
                  <h3 className='text-(--accent-9) mb-2 flex items-center gap-2 text-xl font-semibold lg:text-2xl'>
                    <span className={clsx(feature.icon, 'text-3xl lg:text-6xl')} />
                    {feature.title}
                  </h3>
                  <p className='lg:pl-17 pl-10 text-lg font-light text-neutral-600 lg:text-2xl'>
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className='lg:flex lg:items-center lg:justify-center'>
                <div className='rounded bg-white p-2 ring-1 ring-neutral-300'>
                  <div className='lg:w-100 aspect-5/3 lg:h-60'>{feature.content}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
