import { Button, IconButton } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import { useLocation, useNavigate } from 'react-router'
import useSWRMutation from 'swr/mutation'
import { useRom } from '@/pages/library/hooks/use-rom.ts'
import { api } from '@/utils/http.ts'
import { GameCover } from './game-cover.tsx'

export function GameMediaBoxart() {
  const rom = useRom()
  const navigate = useNavigate()
  const location = useLocation()

  const { isMutating: isUploadingBoxart, trigger: uploadBoxart } = useSWRMutation(
    `roms/${rom.id}/boxart`,
    (url, { arg }: { arg: FormData }) => api.post(url, { body: arg }),
  )

  const { isMutating: isResettingingBoxart, trigger: resetBoxart } = useSWRMutation(`roms/${rom.id}/boxart`, (url) =>
    api.delete(url),
  )

  async function handleClickResetBoxart() {
    await resetBoxart()
    await navigate(location.pathname, { replace: true })
  }

  async function handleClickUploadBoxart() {
    const file = await fileOpen({ extensions: ['.jpg', '.jpeg', '.png'] })
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      await uploadBoxart(formData)
      await navigate(location.pathname, { replace: true })
    }
  }

  return (
    <div className='flex gap-2'>
      <GameCover className='flex w-20 items-center justify-center bg-neutral-200 object-contain' rom={rom} />
      <div className='flex flex-col gap-2'>
        <IconButton
          disabled={isResettingingBoxart}
          loading={isUploadingBoxart}
          onClick={handleClickUploadBoxart}
          title='Upload'
          variant='soft'
        >
          <span className='icon-[mdi--upload]' />
        </IconButton>

        <Button
          disabled={isUploadingBoxart}
          loading={isResettingingBoxart}
          onClick={handleClickResetBoxart}
          type='button'
          variant='soft'
        >
          <span className='icon-[mdi--undo]' />
          Reset to defaults
        </Button>
      </div>
    </div>
  )
}
