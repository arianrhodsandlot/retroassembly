export function CommunitySection() {
  return (
    <section className='bg-(--accent-9) border-y py-16 text-white'>
      <div className='mx-auto max-w-6xl text-center'>
        <h2 className='mb-6 flex items-center justify-center gap-2 text-3xl font-bold'>
          <span className='icon-[mdi--people-group]' />
          Community
        </h2>
        <p className='mb-4'>
          We kindly request your assistance in reporting any ideas or issues on our Discord channel or GitHub issues.
          <br />
          Your valuable feedback will greatly contribute to enhancing the user experience.
        </p>
        <div className='flex justify-center space-x-8 font-semibold'>
          <a
            className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-black transition-transform hover:-translate-y-px'
            href='https://discord.com'
            rel='noreferrer noopener'
            target='_blank'
          >
            <span className='icon-[logos--discord-icon]' />
            Join our Discord
          </a>
          <a
            className='inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-black transition-transform hover:-translate-y-px'
            href='https://github.com/arianrhodsandlot/retro-assembly'
            rel='noreferrer noopener'
            target='_blank'
          >
            <span className='icon-[logos--github-icon]' />
            Visit our GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
