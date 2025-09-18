import { Button, Dialog, IconButton } from '@radix-ui/themes'
import type { InferRequestType } from 'hono'
import { type PropsWithChildren, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { client } from '@/api/client.ts'
import { DialogRoot } from '@/pages/library/components/dialog-root.tsx'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { useRouter } from '@/pages/library/hooks/use-router.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { GameInfoDataList } from './game-info-data-list.tsx'

const defaultTrigger = (
  <IconButton
    aria-label='Edit metadata'
    className='!transition-opacity group-hover:!opacity-100 lg:!opacity-0'
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

  const { isMutating, trigger } = useSWRMutation(
    { endpoint: 'roms', method: 'patch', param: { id: rom.id } },
    ({ param }, { arg: form }: { arg: InferRequestType<(typeof client.roms)[':id']['$patch']>['form'] }) =>
      client.roms[':id'].$patch({ form, param }),
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    await trigger(Object.fromEntries(formData))
    setOpen(false)
    await reloadSilently()
  }

  if (isDemo) {
    return
  }

  return (
    <DialogRoot onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content aria-describedby={undefined} className='lg:!w-2xl'>
        <Dialog.Title className='!-ml-1 flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--view-list]' />
          {getRomGoodcodes(rom).rom}
        </Dialog.Title>

        <form autoComplete='off' onSubmit={handleSubmit}>
          <GameInfoDataList autoFocusField={autoFocusField} />

          <div className='mt-4 flex justify-end gap-4'>
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
