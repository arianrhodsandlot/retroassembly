import { Card } from '@radix-ui/themes'
import { range } from 'es-toolkit'

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
      description: 'Save your progress and access it from anywhere.',
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
      description: 'Rewind gameplay using "R" on the keyboard or a controller button combination (Select + L2).',
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
        <div className='mt-4 grid grid-cols-1 gap-8 md:grid-cols-3'>
          {features.map((feature) => (
            <Card className='flex-1' key={feature.title} size='3'>
              <h3 className='mb-2 flex items-center gap-2 text-xl font-semibold'>
                <span className={feature.icon} />
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
