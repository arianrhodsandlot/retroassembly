import { Button } from '@radix-ui/themes'

export function ButtonSection() {
  return (
    <section className='bg-[var(--accent-2)] py-16'>
      <div className='mx-auto flex max-w-6xl items-center justify-center'>
        <Button size='4' type='button'>
          <span className='icon-[ic--baseline-play-arrow]' />
          Start to build your library
        </Button>
      </div>
    </section>
  )
}
