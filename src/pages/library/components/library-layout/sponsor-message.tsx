import { Button, Dialog } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { linkMap } from '#@/constants/links.ts'
import { useGlobalLoaderData } from '#@/pages/hooks/use-global-loader-data.ts'

export function SponsorMessage() {
  const { t } = useTranslation()
  const { isOfficialHost } = useGlobalLoaderData()

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button type='button'>
          <span className='icon-[mdi--donation]' />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth='500px' aria-describedby={undefined}>
        <Dialog.Title>
          <div className='flex items-center'>
            <span className='icon-[mdi--donation] mr-1' />
            {t('sponsor.title')}
          </div>
        </Dialog.Title>

        <div className='prose-sm'>
          <p>{t('sponsor.intro')}</p>
          <p>{t('sponsor.bodyGrowth')}</p>
          <p>{t('sponsor.bodySupport')}</p>
          <div className='mt-4 flex items-center justify-center'>
            <Button radius='large' asChild>
              <a href={linkMap.kofi.url} target='_blank' rel='noopener noreferrer'>
                <span className='relative flex items-center justify-center'>
                  <span className='icon-[mdi--heart] absolute animate-ping' />
                  <span className='icon-[mdi--heart]' />
                </span>
                {linkMap.kofi.text}
              </a>
            </Button>
          </div>
          <p>{t('sponsor.footer')}</p>
        </div>

        <div className='mt-4 flex items-center justify-end gap-4'>
          {isOfficialHost ? null : (
            <Dialog.Close>
              <Button
                variant='ghost'
                onClick={() => {
                  localStorage.setItem('supress-sponsor-message', '1')
                  globalThis.dispatchEvent(new Event('supress-sponsor-message'))
                }}
              >
                <span className='icon-[mdi--ban]' />
                {t('common.doNotShowAgain')}
              </Button>
            </Dialog.Close>
          )}
          <Dialog.Close>
            <Button variant='soft'>
              <span className='icon-[mdi--close]' />
              {t('common.close')}
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
