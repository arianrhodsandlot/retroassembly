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
      <Dialog.Content maxWidth='500px'>
        <Dialog.Title>
          <div className='flex items-center'>
            <span className='icon-[mdi--donation] mr-1' />
            {t('Support the future of RetroAssembly')}
          </div>
        </Dialog.Title>

        <div className='prose-sm'>
          <p>{t("Hi! I'm @arianrhodsandlot, the designer and developer behind RetroAssembly.")}</p>
          <p>
            {t(
              'RetroAssembly is a labor of love by a retro gaming enthusiast for you. I feel encouraged that my work has received widespread recognition. The number of registered users on the website and the downloads of the Docker images continue to grow steadily.',
            )}
          </p>
          <p>
            {t(
              "As the project grows, so do the costs associated with it. Hosting, maintaining, and improving RetroAssembly requires resources, and that's where your support comes in. By sponsoring me, you can help cover the costs of all the expenses involved in keeping the project running smoothly.",
            )}
          </p>
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
          <p>
            {t('Your support will help keep RetroAssembly sustainable. Thank you for considering becoming a sponsor!')}
          </p>
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
                {t('Do not show again')}
              </Button>
            </Dialog.Close>
          )}
          <Dialog.Close>
            <Button variant='soft'>
              <span className='icon-[mdi--close]' />
              {t('Close')}
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
