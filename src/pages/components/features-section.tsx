import clsx from 'clsx'
import { range } from 'es-toolkit'
import { Pong } from './pong.tsx'

export function FeaturesSection() {
  const features = [
    {
      description: 'Play retro games directly in your browser without additional software.',
      icon: 'icon-[mdi--web-box]',
      title: 'Browser-Based Gameplay',
    },
    {
      description: 'Supports a wide range of retro gaming systems.',
      icon: 'icon-[mdi--space-invaders]',
      title: 'Multi-Platform Support',
    },
    {
      description: 'Sync your games and states then access them from anywhere.',
      icon: 'icon-[mdi--cloud]',
      title: 'Cloud Sync',
    },
    {
      description: "Automatically fetch game boxarts to enhance your library's visual appeal.",
      icon: 'icon-[mdi--drawing-box]',
      title: 'Automatic Boxart Retrieval',
    },
    {
      description: 'Navigate seamlessly using a joystick without needing a mouse or keyboard.',
      icon: 'icon-[mdi--controller-round]',
      title: 'Joystick-Friendly Navigation',
    },
    {
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
      <div className='absolute inset-0 size-full'>
        <Pong />
      </div>

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
                  <div className='w-100 h-60 bg-neutral-300' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
