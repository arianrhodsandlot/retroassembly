import { Button, Dialog, Tabs, VisuallyHidden } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { DialogRoot } from '#@/pages/library/components/dialog-root.tsx'
import { CodeBlock } from './code-block.tsx'

const composeYaml = `services:
  retroassembly:
    image: arianrhodsandlot/retroassembly
    ports: [8000:8000]
    volumes: [/path/to/your/data:/app/data]
    restart: unless-stopped`

const dockerCommand = String.raw`docker run -d \
  --name retroassembly \
  -p 8000:8000 \
  -v /path/to/your/data:/app/data \
  arianrhodsandlot/retroassembly`

export function DockerDialog({ onOpenChange, ...props }: Readonly<Dialog.RootProps>) {
  const { t } = useTranslation()

  function handleOpenChange(open: boolean) {
    onOpenChange?.(open)
  }

  return (
    <DialogRoot {...props} onOpenChange={handleOpenChange}>
      <Dialog.Content aria-describedby={undefined} width='600px'>
        <VisuallyHidden>
          <Dialog.Title>{t('Self-Hosting with Docker')}</Dialog.Title>
        </VisuallyHidden>

        <div>
          <Tabs.Root defaultValue='compose'>
            <Tabs.List>
              <Tabs.Trigger value='compose'>{t('Docker Compose')}</Tabs.Trigger>
              <Tabs.Trigger value='cli'>{t('Docker CLI')}</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className='mt-4' value='compose'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='mb-2 font-semibold'>{t('Step 1: Create compose.yaml')}</h3>
                  <CodeBlock className='bg-(--gray-3) overflow-x-auto rounded p-4 text-sm' code={composeYaml} />
                </div>

                <div>
                  <h3 className='mb-2 font-semibold'>{t('Step 2: Start the container')}</h3>
                  <CodeBlock
                    className='bg-(--gray-3) overflow-x-auto rounded p-4 text-sm'
                    code='docker compose up -d'
                  />
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content className='mt-4' value='cli'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='mb-2 font-semibold'>{t('Run with Docker CLI')}</h3>
                  <CodeBlock className='bg-(--gray-3) overflow-x-auto rounded p-4 text-sm' code={dockerCommand} />
                </div>

                <div>
                  <h3 className='mb-2 font-semibold'>{t('Access the application')}</h3>
                  <p className='text-(--gray-11) text-sm'>
                    {t('Once the container is running, open http://localhost:8000 in your browser.')}
                  </p>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <hr className='border-(--gray-3) my-4' />

        <div>
          <a
            className='text-(--accent-9) inline-flex items-center gap-1 text-sm'
            href='https://hub.docker.com/r/arianrhodsandlot/retroassembly'
            rel='noreferrer noopener'
            target='_blank'
          >
            <span className='icon-[mdi--docker] text-lg' />
            {t('View on Docker Hub')}
          </a>
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
