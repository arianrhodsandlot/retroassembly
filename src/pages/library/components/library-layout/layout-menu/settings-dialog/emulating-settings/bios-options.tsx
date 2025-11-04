import { Badge, Button, Card, IconButton, Popover } from '@radix-ui/themes'
import { fileOpen } from 'browser-fs-access'
import { Nostalgist } from 'nostalgist'
import { useTranslation } from 'react-i18next'
import useSWRMutation from 'swr/mutation'
import { client, type InferRequestType, parseResponse } from '@/api/client.ts'
import { platformMap, type PlatformName } from '@/constants/platform.ts'
import { usePreference } from '@/pages/library/hooks/use-preference.ts'
import { getFileMd5 } from '@/utils/isomorphic/misc.ts'
import { SettingsTitle } from '../settings-title.tsx'

const { $delete, $post } = client.preference.bioses

export function BIOSOptions({ platform }: { platform: PlatformName }) {
  const { t } = useTranslation()
  const { isLoading, preference, setPreference } = usePreference()
  const { bioses } = preference.emulator.platform[platform]

  const expectedBioses = platformMap[platform].bioses

  const { isMutating: isDeleting, trigger: handleClickDelete } = useSWRMutation(
    { endpoint: 'preference/bioses', method: 'delete' },
    (_key, { arg: fileName }: { arg: string }) => $delete({ query: { file_name: fileName, platform } }),
    {
      async onSuccess(response) {
        setPreference(await parseResponse(response))
      },
    },
  )

  const { isMutating: isUploading, trigger: upload } = useSWRMutation(
    { endpoint: 'preference/bioses', method: 'post' },
    (_key, { arg: form }: { arg: InferRequestType<typeof $post>['form'] }) => $post({ form }),
    {
      async onSuccess(response) {
        setPreference(await parseResponse(response))
      },
    },
  )

  async function handleClickUpload() {
    const { path } = Nostalgist.vendors
    const extensions = expectedBioses?.map((bios) => path.extname(bios.name)) || []
    const file = await fileOpen({ extensions })
    const expectedBios = expectedBioses?.find((bios) => bios.name === file.name)
    if (!expectedBios) {
      alert(t('According to the selected file\'s name, it is not an expected BIOS file.'))
      return
    }
    const md5 = await getFileMd5(file)
    if (expectedBios.md5 && expectedBios.md5 !== md5) {
      alert(t('The uploaded file is corrupted (MD5 mismatch).\\n\\nExpected MD5: {{expected}}\\nActual MD5: {{actual}}', {
        expected: expectedBios.md5,
        actual: md5,
      }))
      return
    }
    await upload({ file, platform })
  }

  function isBiosUploaded(bios: { name: string; required?: boolean }) {
    return bioses?.some((b) => b.fileName === bios.name)
  }

  function getBiosStatusText(bios: { name: string; required?: boolean }) {
    if (isBiosUploaded(bios)) {
      return ''
    }
    if (bios.required) {
      return t('(required)')
    }
    return t('(optional)')
  }

  function getBiosClassName(bios: { name: string; required?: boolean }) {
    if (isBiosUploaded(bios)) {
      return 'text-green-700'
    }
    if (bios.required) {
      return 'text-red-700'
    }
  }

  const disabled = isLoading || isDeleting || isUploading

  if (!expectedBioses?.length) {
    return
  }

  return (
    <Card>
      <SettingsTitle as='h4'>
        <span className='icon-[mdi--chip]' /> {t('BIOS of {{platform}}', { platform: platformMap[platform].displayName })}
      </SettingsTitle>
      <div className='flex flex-col gap-2 px-6'>
        <div className='flex flex-wrap items-center gap-2'>
          {bioses.map(({ fileName }) => (
            <Badge key={fileName} size='3' variant='surface'>
              <span className='icon-[mdi--file]' />
              {fileName}
              <Popover.Root>
                <Popover.Trigger>
                  <IconButton disabled={disabled} size='1' title={t('Delete')} type='button' variant='ghost'>
                    <span className='icon-[mdi--close]' />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Content size='1'>
                  <Button
                    disabled={disabled}
                    loading={isDeleting}
                    onClick={() => handleClickDelete(fileName)}
                    size='1'
                    variant='soft'
                  >
                    <span className='icon-[mdi--delete]' />
                    {t('Confirm Delete')}
                  </Button>
                </Popover.Content>
              </Popover.Root>
            </Badge>
          ))}
        </div>

        <div className='flex flex-col gap-1'>
          <div>
            <Button
              disabled={disabled && !isUploading}
              loading={isUploading}
              onClick={handleClickUpload}
              size='2'
              variant='soft'
            >
              <span className='icon-[mdi--upload]' />
              {t('Upload')}
            </Button>
          </div>
          <div className='gap-1 text-xs'>
            <span className='opacity-80'>
              {t('Expected BIOS file', { count: expectedBioses.length })}
            </span>
            {expectedBioses.map((bios, index) => (
              <span className='mr-1' key={bios.name}>
                <span className={getBiosClassName(bios)}>
                  <b>{bios.name}</b> {getBiosStatusText(bios)}
                </span>
                <span className='opacity-80'>{index < expectedBioses.length - 1 ? ',' : ''}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
