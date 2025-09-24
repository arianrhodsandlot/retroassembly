import { Button, IconButton } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import useSWRMutation from 'swr/mutation'
import { client, type InferRequestType, parseResponse } from '@/api/client.ts'
import type { PlatformName } from '@/constants/platform.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { SettingsTitle } from '../settings-title.tsx'

const { $delete, $post } = client.preference.bioses

export function BIOSOptions({ platform }: { platform: PlatformName }) {
  const { isLoading, preference, setPreference } = usePreference()
  const { bioses } = preference.emulator.platform[platform]

  const { isMutating: isDeleting, trigger: handleClickDelete } = useSWRMutation(
    { endpoint: 'preference/bioses', method: 'delete' },
    (key, { arg: fileName }: { arg: string }) => $delete({ query: { file_name: fileName, platform } }),
    {
      async onSuccess(response) {
        setPreference(await parseResponse(response))
      },
    },
  )

  const { isMutating: isUploading, trigger: upload } = useSWRMutation(
    { endpoint: 'preference/bioses', method: 'post' },
    (key, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) => $post({ form }),
    {
      async onSuccess(response) {
        setPreference(await parseResponse(response))
      },
    },
  )

  async function handleClickUpload() {
    const file = await fileOpen()
    await upload({ file, platform })
  }

  const disabled = isLoading || isDeleting || isUploading

  return (
    <div>
      <SettingsTitle as='h4'>
        <span className='icon-[mdi--chip]' /> BIOS
      </SettingsTitle>
      <div className='flex flex-wrap gap-2 px-6'>
        {bioses.map(({ fileName }) => (
          <span className='inline-flex items-center gap-1 rounded' key={fileName}>
            <span className='icon-[mdi--file]' />
            {fileName}
            <IconButton
              disabled={disabled}
              onClick={() => handleClickDelete(fileName)}
              size='1'
              title='Delete'
              type='button'
              variant='ghost'
            >
              <span className='icon-[mdi--close]' />
            </IconButton>
          </span>
        ))}
        <Button
          disabled={disabled && !isUploading}
          loading={isUploading}
          onClick={handleClickUpload}
          size='2'
          variant='soft'
        >
          <span className='icon-[mdi--upload]' />
          Upload
        </Button>
      </div>
    </div>
  )
}
