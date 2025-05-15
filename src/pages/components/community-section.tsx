import { links } from '@/constants/links.ts'

export function CommunitySection() {
  return (
    <section className='bg-(--accent-9) border-y px-8 py-16 text-white'>
      <div className='mx-auto max-w-6xl lg:text-center'>
        <h2 className='mb-6 flex items-center justify-center gap-2 text-4xl font-[Roboto_Slab_Variable] font-semibold'>
          <span className='icon-[mdi--people-group]' />
          Community
        </h2>
        <p className='mb-4 text-sm leading-loose lg:text-base'>
          We kindly request your assistance in reporting any ideas or issues on our Discord channel or GitHub issues.
          <br />
          Your valuable feedback will greatly contribute to enhancing the user experience.
        </p>
        <div className='flex flex-col justify-center gap-4 space-x-8 px-8 font-semibold lg:flex-row lg:px-0'>
          {links.map((link) => (
            <a
              className='inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-black lg:w-56'
              href={link.url}
              key={link.name}
              rel='noreferrer noopener'
              target='_blank'
            >
              <span className={link.logo} />
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
