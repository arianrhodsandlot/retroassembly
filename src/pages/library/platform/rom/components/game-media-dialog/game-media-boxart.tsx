import { IconButton } from '@radix-ui/themes'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { api } from '@/utils/http.ts'
import { GameCover } from '../game-cover.tsx'
import { selectImageFile } from './utils.ts'

export function GameMediaBoxart() {
  const initialRom = useRom()
  const [rom, setRom] = useState(initialRom)

  const { isMutating: isUploadingBoxart, trigger: uploadBoxart } = useSWRMutation(
    `roms/${rom.id}/boxart`,
    (url, { arg }: { arg: FormData }) => api.post(url, { body: arg }).json<string>(),
  )

  const { isMutating: isResettingingBoxart, trigger: resetBoxart } = useSWRMutation(`roms/${rom.id}/boxart`, (url) =>
    api.delete(url),
  )

  async function handleClickResetBoxart() {
    await resetBoxart()
    setRom({ ...rom, gameBoxartFileIds: null })
  }

  async function handleClickUploadBoxart() {
    const file = await selectImageFile()
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const gameBoxartFileIds = await uploadBoxart(formData)
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
