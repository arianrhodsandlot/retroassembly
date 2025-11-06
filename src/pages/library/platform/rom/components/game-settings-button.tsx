import { Button, DataList, Dialog, IconButton } from '@radix-ui/themes'
import { DialogRoot } from '@/pages/library/components/dialog-root.tsx'

export function GameSettingsButton() {
  return (
    <DialogRoot>
      <Dialog.Trigger>
        <IconButton
          className='bg-(--color-background)! hidden! size-16! border-2! shadow-none!'
          title='Settings'
          variant='outline'
        >
          <span className='icon-[mdi--cog] size-6' />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title className='flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--book-information-variant]' />
          Game Settings
        </Dialog.Title>

        <DataList.Root className='py-4' size='3'>
          todo
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
