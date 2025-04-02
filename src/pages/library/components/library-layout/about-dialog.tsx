import { Button, Dialog, VisuallyHidden } from '@radix-ui/themes'

export function AboutDialog({ onOpenChange, ...props }: Dialog.RootProps) {
  function handleOpenChange(open: boolean) {
    onOpenChange?.(open)
  }

  return (
    <Dialog.Root {...props} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined}>
        <VisuallyHidden>
          <Dialog.Title className='flex items-center gap-2'>About</Dialog.Title>
        </VisuallyHidden>
        <div className='flex flex-col items-center gap-2 p-4'>
          <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
          <div>RetroAssembly</div>
          <div>version: {GIT_VERSION}</div>
          <div>build time: {BUILD_TIME}</div>
          <div className='flex-center mb-4 mt-1 gap-2 text-xs'>
            <span>© 2025</span>
            <a className='underline' href='https://github.com/arianrhodsandlot' rel='noreferrer' target='_blank'>
              arianrhodsandlot
            </a>
            ·
            <a
              className='flex-center gap-1'
              href='mailto:theguidanceofawhitetower@gmail.com'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--gmail] mr-1 size-4' />
            </a>
            <a
              className='flex-center gap-1'
              href='https://github.com/arianrhodsandlot/retro-assembly'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--github] mr-1 size-4' />
            </a>
            <a
              className='items-center justify-center gap-1'
              href='https://discord.gg/RVVAMcCH'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--discord] mr-1 size-4' />
            </a>
            <a
              className='items-center justify-center gap-1'
              href='https://twitter.com/arianrhodsand'
              rel='noreferrer'
              target='_blank'
            >
              <span className='icon-[simple-icons--x] mr-1 size-4' />
            </a>
          </div>
        </div>

        <div className='absolute right-6 top-6'>
          <Dialog.Close>
            <Button variant='ghost'>
              <span className='icon-[mdi--close] size-5' />
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
