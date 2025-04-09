export function CommunitySection() {
  return (
    <section className='w-full py-16'>
      <div className='mx-auto max-w-6xl text-center'>
        <h2 className='mb-6 text-3xl font-bold'>Community</h2>
        <p className='mb-4 text-gray-300'>Join our community to connect with other retro gaming enthusiasts.</p>
        <div className='flex justify-center space-x-4'>
          <a href='https://github.com/arianrhodsandlot/retro-assembly' rel='noreferrer noopener' target='_blank'>
            GitHub
          </a>
          <a href='https://discord.com' rel='noreferrer noopener' target='_blank'>
            Discord
          </a>
        </div>
      </div>
    </section>
  )
}
