import { Button, Dialog, VisuallyHidden } from '@radix-ui/themes'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { linkMap, links } from '@/constants/links.ts'
import { metadata } from '@/constants/metadata.ts'
import { DialogRoot } from '../../dialog-root.tsx'

export function AboutDialog({ onOpenChange, ...props }: Readonly<Dialog.RootProps>) {
  const { t } = useTranslation()

  function handleOpenChange(open: boolean) {
    onOpenChange?.(open)
  }

  return (
    <DialogRoot {...props} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined} width='340px'>
        <VisuallyHidden>
          <Dialog.Title className='flex items-center gap-2'>{t('About')}</Dialog.Title>
        </VisuallyHidden>
        <div className='flex flex-col items-center gap-2 p-2 text-center'>
          <img alt='logo' height='56' src='/assets/logo/logo-192x192.png' width='56' />
          <a className='text-xl font-semibold' href={metadata.link} rel='noreferrer noopener' target='_blank'>
            {metadata.title}
          </a>
          <div className='text-sm'>{t(metadata.description)}</div>
          <div className='flex flex-col gap-2 py-2 text-xs opacity-70'>
            {metadata.version ? (
              <div>
                {t('Version')}:
                <a
                  className='ml-0.5 underline'
                  href={`${linkMap.github.url}/tree/${metadata.version}`}
                  rel='noreferrer noopener'
                  target='_blank'
                >
                  {metadata.version}
                </a>
              </div>
            ) : null}
            <div>
              {t('Date')}: <span className='ml-0.5'>{metadata.buildDate}</span>
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
    </DialogRoot>
  )
}
