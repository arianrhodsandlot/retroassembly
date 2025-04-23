export function CommunitySection() {
  return (
    <section className='bg-(--accent-2) py-16'>
      <div className='mx-auto max-w-6xl text-center'>
        <h2 className='mb-6 flex items-center justify-center gap-2 text-3xl font-bold'>
          <span className='icon-[mdi--people-group]' />
          Community
        </h2>
        <p className='mb-4'>Join our community to connect with other retro gaming enthusiasts!</p>
        <div className='flex justify-center space-x-8 text-2xl font-semibold'>
          <a
            className='inline-flex items-center gap-2'
            href='https://github.com/arianrhodsandlot/retro-assembly'
            rel='noreferrer noopener'
            target='_blank'
          >
            <span className='icon-[logos--github-icon]' />
            GitHub
          </a>
          <a
            className='inline-flex items-center gap-2'
            href='https://discord.com'
            rel='noreferrer noopener'
            target='_blank'
          >
            <span className='icon-[logos--discord-icon]' />
            Discord
          </a>
        </div>
      </div>
    </section>
  )
}
