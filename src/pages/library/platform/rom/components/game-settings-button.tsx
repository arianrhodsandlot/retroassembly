import { Button, DataList, Dialog, IconButton, SegmentedControl, TextArea, TextField } from '@radix-ui/themes'
import { range } from 'es-toolkit'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { GameCover } from './game-cover.tsx'

export function GameSettingsButton() {
  const rom = useRom()

  if (rom) {
    return
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          className='!bg-(--color-background) !size-16 !border-2 !shadow-none'
          title='Settings'
          variant='outline'
        >
          <span className='icon-[mdi--cog] size-6' />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title className='flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--book-information-variant]' />
          Game infomation
        </Dialog.Title>

        <DataList.Root className='py-4' size='3'>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--image]' />
              Cover
            </DataList.Label>
            <DataList.Value>
              <div className='flex items-center gap-4'>
                <GameCover className='flex size-20 items-center justify-center text-center' rom={rom} />
                <div className='flex flex-col gap-4'>
                  <Button>
                    <span className='icon-[mdi--upload]' />
                    Upload
                  </Button>
                  <Button variant='outline'>
                    <span className='icon-[mdi--close]' />
                    Reset
                  </Button>
                </div>
              </div>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--calendar]' />
              Released
            </DataList.Label>
            <DataList.Value>
              <input title='Released' type='date' />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--tag-multiple]' />
              Genres
            </DataList.Label>
            <DataList.Value>
              <TextField.Root className='w-full' />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--person-multiple]' />
              Players
            </DataList.Label>
            <DataList.Value>
              <SegmentedControl.Root defaultValue='inbox'>
                {range(1, 9).map((value) => (
                  <SegmentedControl.Item key={value} value={String(value)}>
                    {value}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl.Root>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--chip]' />
              Developer
            </DataList.Label>
            <DataList.Value>
              <TextField.Root className='w-full' />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--earth]' />
              Publisher
            </DataList.Label>
            <DataList.Value>
              <TextField.Root className='w-full' />
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label className='flex items-center gap-2' minWidth='40px'>
              <span className='icon-[mdi--note]' />
              Description
            </DataList.Label>
            <DataList.Value>
              <TextArea className='w-full' />
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
    </Dialog.Root>
  )
}
