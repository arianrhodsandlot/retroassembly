import { Button, DataList, Dialog, IconButton } from '@radix-ui/themes'
import { type PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DialogRoot } from '#@/pages/library/components/dialog-root.tsx'
import { useIsDemo } from '#@/pages/library/hooks/use-demo.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { useRouter } from '#@/pages/library/hooks/use-router.ts'
import { getRomGoodcodes } from '#@/utils/client/library.ts'
import { GameMediaBoxart } from './game-media-boxart.tsx'
import { GameMediaImages } from './game-media-images.tsx'

export function GameMediaDialog({ children }: Readonly<PropsWithChildren>) {
  const { t } = useTranslation()
  const rom = useRom()
  const { reload } = useRouter()
  const isDemo = useIsDemo()

  const [open, setOpen] = useState(false)

  async function handleOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      await reload()
    }
  }

  if (isDemo) {
    return
  }

  return (
    <DialogRoot onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger>
        {children || (
          <IconButton
            aria-label={t('game.media.edit')}
            className='transition-opacity! group-hover:opacity-100! lg:opacity-0!'
            title={t('game.media.edit')}
            variant='ghost'
          >
            <span className='icon-[mdi--edit]' />
          </IconButton>
        )}
      </Dialog.Trigger>

      <Dialog.Content aria-describedby={undefined} className='lg:w-xl!'>
        <Dialog.Title className='-ml-1! flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--image-multiple]' />
          {getRomGoodcodes(rom).rom}
        </Dialog.Title>

        <DataList.Root className='py-4' size='3'>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
              <span className='icon-[mdi--image]' />
              {t('game.media.boxArt')}
            </DataList.Label>
            <DataList.Value>
              <GameMediaBoxart />
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
              <span className='icon-[mdi--image-multiple]' />
              {t('game.media.media')}
            </DataList.Label>
            <DataList.Value>
              <GameMediaImages />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <div className='absolute top-6 right-6'>
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
