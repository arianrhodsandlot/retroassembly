import { Button, Dialog, IconButton } from '@radix-ui/themes'
import { type PropsWithChildren, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { useIsDemo } from '@/pages/library/hooks/use-demo.ts'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { api } from '@/utils/http.ts'
import { getRomGoodcodes } from '@/utils/library.ts'
import { GameInfoDataList } from './game-info-data-list.tsx'

const defaultTrigger = (
  <IconButton className='!opacity-0 !transition-opacity group-hover:!opacity-100' title='Edit' variant='ghost'>
    <span className='icon-[mdi--edit]' />
  </IconButton>
)

interface GameInfoDialogProps extends PropsWithChildren {
  autoFocusField?: string
}

export function GameInfoDialog({ autoFocusField, children = defaultTrigger }: GameInfoDialogProps) {
  const rom = useRom()

  const navigate = useNavigate()
  const location = useLocation()
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
    await navigate(location.pathname, { replace: true })
  }

  if (isDemo) {
    return
  }

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className='!w-2xl !max-w-screen'>
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
    </Dialog.Root>
  )
}
