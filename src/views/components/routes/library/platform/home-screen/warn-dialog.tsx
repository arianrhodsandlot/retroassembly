import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@radix-ui/react-dialog'
import { addDays, isAfter } from 'date-fns'
import { useState } from 'react'
import { BaseButton } from '../../../../primitives/base-button'

const DIALOG_CLOSED_TIMESTAMP_KEY = 'retroassemblyClassicWarnDialogClosedTimestamp'
function getInitialOpenState() {
  const lastClosedTimestampString = localStorage.getItem(DIALOG_CLOSED_TIMESTAMP_KEY)
  if (lastClosedTimestampString) {
    const lastClosedTimestamp = Number.parseInt(lastClosedTimestampString, 10)
    const after = addDays(lastClosedTimestamp, 7)
    return isAfter(new Date(), after)
  }
  return true
}

export function WarnDialog() {
  const [open, setOpen] = useState(getInitialOpenState)

  function handleClickClose() {
    setOpen(false)
  }

  function handleClickHide() {
    setOpen(false)
    localStorage.setItem(DIALOG_CLOSED_TIMESTAMP_KEY, Date.now().toString())
  }

  return (
    <Dialog open={open}>
      <DialogPortal>
        <DialogOverlay asChild>
          <div className='fixed inset-0 z-10 bg-[#000000aa]' />
        </DialogOverlay>

        <DialogContent className='modal fixed left-1/2 top-1/2 z-10 max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded bg-white p-6'>
          <button type='button' onClick={handleClickClose} className='absolute right-4 top-4 text-2xl'>
            &times;
          </button>
          <DialogTitle className='flex items-center justify-center gap-2 text-xl font-semibold text-rose-700'>
            <span className='icon-[mdi--weather-sunset] size-8 shrink-0' />
            Sunsetting RetroAssembly classic
          </DialogTitle>
          <div className='mt-10 flex flex-col gap-4 text-sm'>
            <p>
              <b>We are in the process of sunsetting RetroAssembly Classic.</b>
              The classic version of RetroAssembly you are using now is no longer actively maintained, and no new
              features will be added.
            </p>

            <p>
              <b>
                We encourage you to try the new version of RetroAssembly at{' '}
                <a
                  className='text-rose-700 underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://retroassembly.com?utm_source=classic.retroassembly.com&utm_medium=dialog'
                >
                  retroassembly.com
                </a>
                .
              </b>{' '}
              It's just as easy to use as the classic version and features a more refined design with additional handy
              features, such as automatic game metadata retrieval, upgraded emulators, improved gamepad support, CRT
              shaders, and more.
            </p>

            <p className='text-center'>
              <a
                className='inline-block'
                target='_blank'
                rel='noopener noreferrer'
                href='https://retroassembly.com?utm_source=classic.retroassembly.com&utm_medium=dialog'
              >
                <img
                  width={512}
                  height={288}
                  src='https://retroassembly.com/assets/screenshots/library.jpeg'
                  alt='new RetroAssembly'
                />
              </a>
            </p>

            <p>
              Rest assured, the classic version of RetroAssembly will always be accessible at{' '}
              <a className='text-rose-700 underline' href='https://classic.retroassembly.com'>
                classic.retroassembly.com
              </a>
              . All your data is preserved, and you can continue to use it as you always have.
            </p>

            <p>
              Thank you for using RetroAssembly! We hope you'll have a great experience with our new version at{' '}
              <a
                className='text-rose-700 underline'
                target='_blank'
                rel='noopener noreferrer'
                href='https://retroassembly.com?utm_source=classic.retroassembly.com&utm_medium=dialog'
              >
                retroassembly.com
              </a>
              .
            </p>
          </div>

          <div className='mt-10 flex flex-col items-center justify-center gap-4'>
            <BaseButton onClick={handleClickClose} styleType='primary'>
              <span className='icon-[mdi--hand-okay] size-5' />
              OK
            </BaseButton>
            <button onClick={handleClickHide} className='text-xs text-rose-700 underline' type='button'>
              Do not show again in this week
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
