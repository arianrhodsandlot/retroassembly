import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { type PropsWithChildren, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { DialogRoot } from '@/pages/library/components/dialog-root.tsx'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useRouter } from '@/pages/library/hooks/use-router.ts'
import { api } from '@/utils/http.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { GameInfoDataList } from './game-info-data-list.tsx'

const defaultTrigger = (
  <IconButton
    aria-label='Edit metadata'
    className='!opacity-0 !transition-opacity group-hover:!opacity-100'
    title='Edit metadata'
    variant='ghost'
  >
    <span className='icon-[mdi--edit]' />
  </IconButton>
)

interface GameInfoDialogProps extends PropsWithChildren {
  autoFocusField?: string
}

export function GameInfoDialog({ autoFocusField, children = defaultTrigger }: Readonly<GameInfoDialogProps>) {
  const rom = useRom()

  const { reloadSilently } = useRouter()
  const isDemo = useIsDemo()

  const [open, setOpen] = useState(false)

  const { isMutating, trigger } = useSWRMutation(`roms/${rom.id}`, (url, { arg }: { arg: FormData }) =>
    api.patch(url, { body: arg }),
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    await trigger(formData)
    setOpen(false)
    await reloadSilently()
  }

  if (isDemo) {
    return
  }

  return (
    <DialogRoot onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content aria-describedby={undefined} className='!w-2xl !max-w-screen'>
        <Dialog.Title className='!-ml-1 flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--view-list]' />
          {getRomGoodcodes(rom).rom}
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <GameInfoDataList autoFocusField={autoFocusField} />

          <div className='flex justify-end gap-4'>
            <Dialog.Close>
              <Button disabled={isMutating} variant='soft'>
                <span className='icon-[mdi--close]' />
                Cancel
              </Button>
            </Dialog.Close>
            <Button loading={isMutating} type='submit'>
              <span className='icon-[mdi--content-save]' />
              Save
            </Button>
          </div>
        </form>

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
