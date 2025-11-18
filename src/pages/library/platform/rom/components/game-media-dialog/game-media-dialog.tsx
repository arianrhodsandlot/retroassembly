import { Button, DataList, Dialog, IconButton } from '@radix-ui/themes'
import { type PropsWithChildren, useState } from 'react'
import { DialogRoot } from '#@/pages/library/components/dialog-root.tsx'
import { useIsDemo } from '#@/pages/library/hooks/use-demo.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { useRouter } from '#@/pages/library/hooks/use-router.ts'
import { getRomGoodcodes } from '#@/utils/client/library.ts'
import { GameMediaBoxart } from './game-media-boxart.tsx'
import { GameMediaImages } from './game-media-images.tsx'

const defaultTrigger = (
  <IconButton
    aria-label='Edit images'
    className='!transition-opacity group-hover:!opacity-100 lg:!opacity-0'
    title='Edit images'
    variant='ghost'
  >
    <span className='icon-[mdi--edit]' />
  </IconButton>
)

export function GameMediaDialog({ children = defaultTrigger }: Readonly<PropsWithChildren>) {
  const rom = useRom()
  const { isReloading, reload } = useRouter()
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
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content aria-describedby={undefined} className='lg:!w-xl'>
        <Dialog.Title className='!-ml-1 flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--image-multiple]' />
          {getRomGoodcodes(rom).rom}
          {isReloading ? <span className='icon-[svg-spinners--180-ring]' /> : null}
        </Dialog.Title>

        <DataList.Root className='py-4' size='3'>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
              <span className='icon-[mdi--image]' />
              Box Art
            </DataList.Label>
            <DataList.Value>
              <GameMediaBoxart />
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
              <span className='icon-[mdi--image]' />
              Images
            </DataList.Label>
            <DataList.Value>
              <GameMediaImages />
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

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
