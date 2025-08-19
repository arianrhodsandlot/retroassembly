import { UTCDateMini } from '@date-fns/utc'
import { Button, DataList, Dialog, IconButton, Select, TextArea, TextField } from '@radix-ui/themes'
import { formatDate } from 'date-fns'
import { range } from 'es-toolkit'
import { type PropsWithChildren, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { api } from '@/utils/http.ts'
import { GameCover } from './game-cover.tsx'

const defaultTrigger = (
  <IconButton className='!opacity-0 !transition-opacity group-hover:!opacity-100' variant='ghost'>
    <span className='icon-[mdi--edit]' />
  </IconButton>
)

export function GameInfoDialog({ children = defaultTrigger }: PropsWithChildren) {
  const rom = useRom()
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const launchboxGame = rom.launchboxGame || {}
  const gameInfo = {
    description: rom.gameDescription ?? launchboxGame.overview,
    developer: rom.gameDeveloper ?? launchboxGame.developer,
    genres: rom.gameGenres ?? launchboxGame.genres,
    name: rom.gameName ?? launchboxGame.name,
    players: rom.gamePlayers ?? launchboxGame.maxPlayers,
    publisher: rom.gamePublisher ?? launchboxGame.publisher,
    releaseDate: rom.gameReleaseDate ?? launchboxGame.releaseDate,
  }
  const date = new UTCDateMini(gameInfo.releaseDate)
  gameInfo.releaseDate = date.getTime() ? formatDate(date, 'yyyy-MM-dd') : ''

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

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className='!w-4xl !max-w-screen'>
        <Dialog.Title className='!-ml-1 flex items-center gap-2 text-xl font-semibold'>
          <span className='icon-[mdi--book-information-variant]' />
          Game infomation
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <DataList.Root className='py-4' size='3'>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--image]' />
                Box art
              </DataList.Label>
              <DataList.Value>
                <div className='flex items-center gap-4 py-4'>
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
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--calendar]' />
                Released
              </DataList.Label>
              <DataList.Value>
                <TextField.Root defaultValue={gameInfo.releaseDate} name='gameReleaseDate' />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--tag-multiple]' />
                Genres
              </DataList.Label>
              <DataList.Value>
                <TextField.Root className='w-full' defaultValue={gameInfo.genres} name='gameGenres' />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--person-multiple]' />
                Players
              </DataList.Label>
              <DataList.Value>
                <Select.Root defaultValue={`${gameInfo.players}`} name='gamePlayers'>
                  <Select.Trigger />
                  <Select.Content>
                    {range(0, 11).map((value) => (
                      <Select.Item key={value} value={`${value}`}>
                        {value}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--chip]' />
                Developer
              </DataList.Label>
              <DataList.Value>
                <TextField.Root className='w-full' defaultValue={gameInfo.developer} name='gameDeveloper' />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--earth]' />
                Publisher
              </DataList.Label>
              <DataList.Value>
                <TextField.Root className='w-full' defaultValue={gameInfo.publisher} name='gamePublisher' />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label className='flex items-center gap-2 text-sm' minWidth='32px'>
                <span className='icon-[mdi--note]' />
                Description
              </DataList.Label>
              <DataList.Value>
                <TextArea
                  className='w-full text-justify !font-[Roboto_Slab_Variable]'
                  defaultValue={gameInfo.description}
                  name='gameDescription'
                  resize='vertical'
                  rows={10}
                />
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>

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
