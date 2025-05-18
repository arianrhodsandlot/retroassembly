import clsx from 'clsx'
import { useAtom } from 'jotai'
import { showBannerAtom } from '../../../../atoms'

export function NextVersionBanner() {
  const [showBanner, setShowBanner] = useAtom(showBannerAtom)

  function handleClickClose() {
    setShowBanner(false)
  }

  return (
    <div
      className={clsx(
        'hidden h-8 items-center bg-rose-800 text-center text-xs text-white transition-[margin-top] lg:flex',
        { '-mt-8': !showBanner },
      )}
    >
      <a // eslint-disable-line @eslint-react/dom/no-unsafe-target-blank
        target='_blank' // eslint-disable-line biome-x/lint
        rel='noopener'
        className='flex flex-1 items-center justify-center gap-1 underline'
        href='https://next.retroassembly.com/?utm_source=retroassembly.com&utm_medium=website'
      >
        <span className='icon-[noto--fire]' />
        Be the first to experience the new preview version. Check it out at <b>next.retroassembly.com</b> now and share
        your thoughts!
      </a>
      <button
        type='button'
        onClick={handleClickClose}
        className='mr-2 flex size-5 items-center justify-center rounded-full bg-white text-lg text-rose-800'
      >
        &times;
      </button>
    </div>
  )
}
