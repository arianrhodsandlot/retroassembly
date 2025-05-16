export function FooterSection() {
  return (
    <footer className='border border-x-0 border-b-0 border-t-neutral-200 p-8 text-center text-sm font-light text-neutral-500'>
      <div className='w-xl mx-auto flex max-w-full flex-col items-center justify-center gap-1 sm:flex-row sm:flex-wrap sm:gap-x-2 sm:gap-y-1'>
        <div className='inline-flex flex-wrap items-center gap-0.5'>
          <span className='icon-[mdi--git] size-3.5' />
          Version:
          <a
            className='ml-0.5 underline'
            href={`https://github.com/arianrhodsandlot/retroassembly/commit/${GIT_VERSION}`}
            rel='noreferrer noopener'
            target='_blank'
          >
            {GIT_VERSION}
          </a>
        </div>

        <div className='inline-flex flex-wrap items-center gap-0.5'>
          <span className='icon-[mdi--clock-check] size-3.5' /> Last updated: {BUILD_TIME}
        </div>

        <div className='inline-flex flex-wrap items-center gap-0.5'>
          <span className='icon-[mdi--license] size-3.5' />
          Released under{' '}
          <a className='underline' href='https://opensource.org/license/mit' rel='noreferrer noopener' target='_blank'>
            the MIT License
          </a>
        </div>
        <div className='inline-flex flex-wrap items-center gap-0.5'>
          <span className='icon-[mdi--copyright] size-3.5' />
          <span>2025 </span>
          <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer noopener' target='_blank'>
            arianrhodsandlot
          </a>
          . All rights reserved
        </div>
      </div>
    </footer>
  )
}
