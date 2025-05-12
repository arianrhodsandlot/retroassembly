import clsx from 'clsx'
import { range } from 'es-toolkit'
import { getPlatformDeviceBackground } from '@/utils/library.ts'

export function FeaturesSection() {
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
        <div className='grid size-full grid-cols-3 grid-rows-2 gap-2'>
          <div className='rounded bg-neutral-100' />
          <div className='rounded bg-neutral-100' />
          <div className='rounded bg-neutral-100' />
          <div className='rounded bg-neutral-100' />
          <div className='rounded bg-neutral-100' />
          <div className='rounded bg-neutral-100' />
        </div>
      ),
      description: 'Navigate seamlessly using a joystick without needing a mouse or keyboard.',
      icon: 'icon-[mdi--controller-round]',
      title: 'Joystick-Friendly Navigation',
    },
    {
      content: (
        <div className='flex size-full items-center justify-center'>
          <span className='icon-[svg-spinners--clock] rotate-x-180 size-32 opacity-50' />
        </div>
      ),
      description: (
        <>
          Rewind gameplay using "R" on the keyboard or a controller button combination (<kbd>Select</kbd> +{' '}
          <kbd>L2</kbd>).
        </>
      ),
      icon: 'icon-[mdi--clock-arrow]',
      title: 'Rewind Gameplay',
    },
  ]

  return (
    <section className='relative py-16'>
      <div className='mx-auto max-w-6xl '>
        <h2
          className='text-(--accent-9) mb-6 flex items-center justify-center gap-2 text-4xl font-[Roboto_Slab_Variable] font-semibold'
          style={{
            textShadow: range(1, 5)
              .map((number) => `${number}px ${number}px 1px var(--accent-7)`)
              .join(','),
          }}
        >
          <span className='icon-[mdi--gift]' />
          Features
        </h2>
        <div className='w-4xl mx-auto mt-20 flex flex-col gap-16'>
          {features.map((feature, index) => (
            <div className={clsx('flex justify-center gap-10', { 'flex-row-reverse': index % 2 })} key={feature.title}>
              <div className='flex flex-1 items-center'>
                <div>
                  <h3 className='mb-2 flex items-center gap-2 text-xl font-semibold'>
                    <span className={feature.icon} />
                    {feature.title}
                  </h3>
                  <p>{feature.description}</p>
                </div>
              </div>

              <div className='flex items-center justify-center'>
                <div className='rounded bg-white p-2 shadow-lg ring-1 ring-neutral-300'>
                  <div className='w-100 h-60'>{feature.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
