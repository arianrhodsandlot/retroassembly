import { IconButton } from '@radix-ui/themes'
import type { InferRequestType } from 'hono'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { client, parseResponse } from '#@/api/client.ts'
import { useRom } from '#@/pages/library/hooks/use-rom.ts'
import { GameCover } from '../game-cover.tsx'
import { selectImageFile } from './utils.ts'

const endpoint = 'roms/:id/boxart'
const { $delete, $post } = client.roms[':id'].boxart

export function GameMediaBoxart() {
  const initialRom = useRom()
  const [rom, setRom] = useState(initialRom)
  const param = { id: rom.id }
  const { isMutating: isUploadingBoxart, trigger: uploadBoxart } = useSWRMutation(
    { endpoint, method: 'post', param },
    ({ param }, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) => $post({ form, param }),
  )

  const { isMutating: isResettingingBoxart, trigger: resetBoxart } = useSWRMutation(
    { endpoint, method: 'delete', param },
    ({ param }) => $delete({ param }),
  )

  async function handleClickResetBoxart() {
    await resetBoxart()
    setRom({ ...rom, gameBoxartFileIds: null })
  }

  async function handleClickUploadBoxart() {
    const file = await selectImageFile()
    if (file) {
      const gameBoxartFileIds = await parseResponse(uploadBoxart({ file }))
      setRom({ ...rom, gameBoxartFileIds })
    }
  }

  return (
    <div className='flex gap-2'>
      <GameCover className='flex w-20 items-center justify-center object-contain' rom={rom} />
      <div className='flex flex-col justify-center gap-2'>
        <IconButton
          disabled={isResettingingBoxart}
          loading={isUploadingBoxart}
          onClick={handleClickUploadBoxart}
          title='Upload'
          variant='soft'
        >
          <span className='icon-[mdi--upload]' />
        </IconButton>

        <IconButton
          disabled={isUploadingBoxart}
          loading={isResettingingBoxart}
          onClick={handleClickResetBoxart}
          title='Reset to defaults'
          type='button'
          variant='soft'
        >
          <span className='icon-[mdi--restore]' />
        </IconButton>
      </div>
    </div>
  )
}
