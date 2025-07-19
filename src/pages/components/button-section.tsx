import { ButtonLinks } from './button-links.tsx'
import background from './button-section-background.svg'
import { Paralolas } from './parabolas.tsx'

export function ButtonSection() {
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

      <div className='lg:w-2xl motion-preset-oscillate-sm motion-duration-3000 bg-(--color-background) [.dark_&]:bg-(--gray-2) relative mx-8 rounded-xl p-10 shadow-[0_0_32px_rgba(0,0,0,0.1)] lg:mx-auto'>
        <h2 className='text-(--accent-9) flex items-center justify-center gap-2 text-center text-xl font-semibold lg:text-3xl'>
          Start to enjoy retro gaming now!
        </h2>

        <ButtonLinks />
      </div>
    </section>
  )
}
