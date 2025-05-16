import { Button, Dialog, VisuallyHidden } from '@radix-ui/themes'
import clsx from 'clsx'
import { links } from '@/constants/links.ts'

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
        <div className='flex flex-col items-center gap-2 p-2'>
          <img alt='logo' height='56' src='/assets/logo/logo-192x192.png' width='56' />
          <div className='text-xl font-semibold'>RetroAssembly</div>
          <div className='text-sm'>Your personal retro game collection cabinet in your browser</div>
          <div className='flex gap-2 text-xs opacity-70'>
            <div>
              Version:
              <a
                className='ml-0.5 underline'
                href={`https://github.com/arianrhodsandlot/retro-assembly/commit/${GIT_VERSION}`}
                rel='noreferrer noopener'
                target='_blank'
              >
                {GIT_VERSION}
              </a>
            </div>
            <div>
              Last updated: <span className='ml-0.5'>{BUILD_TIME}</span>
            </div>
          </div>
          <div className='mb-4 mt-1 flex items-center justify-center gap-2 text-xs'>
            <span>&copy; 2025</span>
            <a
              className='underline'
              href='https://github.com/arianrhodsandlot'
              rel='noreferrer noopener'
              target='_blank'
            >
              arianrhodsandlot
            </a>
            ·
            {links.map((link) => (
              <a
                className='flex-center gap-1'
                href={link.url}
                key={link.name}
                rel='noreferrer noopener'
                target='_blank'
                title={link.name}
              >
                <span className={clsx(link.icon, 'mr-1 size-4')} />
              </a>
            ))}
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
